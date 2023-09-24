import { Observable } from "rxjs/internal/Observable";
import { QuestionService } from "../question.service";
import { QuestionBase } from "../controls/question-base";
import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Injectable,
  OnInit,
} from "@angular/core";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { BehaviorSubject, take } from "rxjs";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { Article } from "../modal/article";
import { ArticleService } from "../artical.service";
import { AuthorizeService } from "../authorize.service";
import { ActivatedRoute } from "@angular/router";

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
  props!: ArticalControlBase<string>;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
  props!: ArticalControlBase<string>;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  div: {
    div: ["XXX"],
  },
  // Reminders: [
  //   'Cook dinner',
  //   'Read the Material Design spec',
  //   'Upgrade Application to Angular',
  // ],
};
const availableStyles = {
  "": [],
  div: [
    "jumbotron",
    "feature",
    "container",
    "container-main",
    "row",
    "col-lg-12",
    "col-md-4",
    "article-intro",
    "article-intro-row",
    "col-md-3",
  ],
  h1: ["page-header"],
  br: [],
  pera: [],
  "card-artical": [],
  h3: [],
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  templateLoad(template: any) {
    const data = this.buildFileTree(template, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === "object") {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  buildFileArticleTree(
    obj: { [key: string]: ArticalControlBase<string> },
    level: number
  ): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>(
      (accumulator, [key, val]) => {
        const value = obj[key];
        const node = new TodoItemNode();
        node.item = key;

        if (value != null) {
          if (typeof value === "object") {
            node.children = this.buildFileTree(value, level + 1);
          } else {
            node.item = value;
          }
        }

        return accumulator.concat(node);
      },
      []
    );
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }
  deleteItem(parent: TodoItemNode, name: string): void {
    if (parent.children) {
      parent.children = parent.children.filter((c) => c.item !== name);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    node.children = [{ item: "XXX" } as TodoItemNode];
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
  providers: [ChecklistDatabase],
})
export class AdminComponent implements AfterViewChecked {
  needToLogin: boolean = this.authorizeService.neetToLogin;
  questions$: Observable<QuestionBase<any>[]>;
  statusMessage = { message: "", color: "" };
  selectedNode?: { node: TodoItemFlatNode; isSelected: boolean };
  selectedMenu?: { node: TodoItemFlatNode; isSelected: boolean };
  selectedNodeItem: string = "";
  propPosition: string = "top: 45px;";
  totalStyles = new Map<string, string[]>();
  expanded = false;
  chkStyle = "display: none";
  cssSelected = "";
  togglePreviewText = "Open Preview";
  //articalControls: ArticalControlBase<string>[] = [];
  previewUrl = "";
  // constructor() {

  // }
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = "";

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  //crtlsTreeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(
    true /* multiple */
  );

  constructor(
    private _database: ChecklistDatabase,
    service: QuestionService,
    private articleService: ArticleService,
    private authorizeService: AuthorizeService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
    this.questions$ = service.getQuestions();

    this.treeControl.expandAll();
    this.totalStyles = this.convertJSObjToTSMap(availableStyles);

    console.log("this.totalStyles", this.totalStyles);
  }

  convertJSObjToTSMap(jsObj: any) {
    const tsMap = new Map();
    const arrayOfMapEntries = new Map<any, any>(Object.entries(jsObj));
    for (const [key, value] of arrayOfMapEntries.entries()) {
      tsMap.set(key, value);
    }
    return tsMap;
  }
  ngAfterViewChecked(): void {
    this.treeControl.dataNodes.forEach((d) => this.deleteDefault(d));
    this.ref.detectChanges();
  }

  deleteDefault = (node: TodoItemFlatNode) => {
    if (node.item == "XXX") {
      console.log("deleteDefault", node);
      this.removeItem(node);
    }
  };

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) =>
    _nodeData.item === "";

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();

    if (node.props == undefined) {
      node.props = new ArticalControlBase<string>({ key: node.item });
    }
    if (node.props.key == "") {
      node.props.key = node.item;
    }

    if (node.props.css != "") {
      node.props?.css?.split(" ")?.forEach((css) => {
        if (
          !this.totalStyles.get(node?.props?.controlType)?.find((v) => v == css)
        ) {
          this.totalStyles.get(node?.props?.controlType)?.push(css);
        }
      });
    }
    flatNode.item = node.item;
    flatNode.props = node.props;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  ReloadPreview() {
    this.updateCache();

    (<HTMLIFrameElement>document.getElementById("iframe-preview")).src =
      "/preview?postId=" + (this.selectedMenu?.node.props as Article).id;
  }

  savePreviewArticle() {
    let previewCrtls: ArticalControlBase<string>[] = [];
    this.treeControl.dataNodes.forEach((crtl) => {
      if (crtl.level == 0) {
        previewCrtls.push(crtl.props);
      }
    });

    let article: Article = this.selectedMenu?.node.props as Article;
    article.controls = previewCrtls;
    article.order = Number.parseInt(article.order + "");
    article.content = JSON.stringify(previewCrtls);
    console.log("article going to save", article);
    this.saveArticleByValidation(article);
  }

  togglePreview() {
    let previewEle = document.getElementById("preview-div");
    if (previewEle!.style.display == "none") {
      //console.log("previewCrtls", previewCrtls);
      previewEle!.style.display = "block";
      this.updateCache();
      (<HTMLIFrameElement>document.getElementById("iframe-preview")).src =
        "/preview?postId=" + (this.selectedMenu?.node.props as Article).id;
      this.togglePreviewText = "Close Preview";
    } else {
      previewEle!.style.display = "none";
      this.togglePreviewText = "Open Preview";
    }
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  updateCache() {
    let previewCrtls: ArticalControlBase<string>[] = [];
    let selectedManuNode = this.selectedMenu?.node as TodoItemFlatNode;
    this.treeControl.dataNodes.forEach((crtl) => {
      if (crtl.level == 0) {
        previewCrtls.push(crtl.props);
      }
    });
    
    (selectedManuNode.props as Article).controls = previewCrtls;
    localStorage.setItem("selectedpage", JSON.stringify(selectedManuNode));
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.selectedNode = {
      node: node,
      isSelected: !this.checklistSelection.isSelected(node),
    };
    //console.log("todoItemSelectionToggle", this.selectedNode);
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  cssSelectionChange(e: any, crtl: any) {
    if (e.target.checked) {
      this.cssSelected = this.cssSelected + " " + crtl.name;
    } else {
      let removedlst = this.cssSelected
        .split(" ")
        .filter((v) => v != crtl.name);
      this.cssSelected = removedlst.join(" ");
    }
    this.selectedNode!.node.props.css = this.cssSelected;
  }

  getControlKeyValue(selectedNode: any, field: string) {
    let crtl: ArticalControlBase<string> = selectedNode.node.props;
    let mapObject = new Map<string, any>(Object.entries(crtl));
    // if (field == "required") {
    //   console.log("mapObject.get(field)", mapObject.get(field));
    // }
    if (field == "children" && crtl.children) {
      let childrenKys: string[] = [];
      crtl.children.forEach((v) => childrenKys.push(v.key));
      return childrenKys.join("; ");
    } else if (field == "css") {
      let csslst = this.totalStyles.get(crtl.controlType);
      let resultCsslst: any[] = [];
      this.cssSelected = crtl?.css;
      let selectedCss = crtl?.css?.split(" ");
      csslst?.forEach((css) =>
        resultCsslst.push({
          id: crtl.key + "-css-" + css,
          name: css,
          selected: selectedCss.find((v) => v == css) != null,
        })
      );

      return resultCsslst;
    } else {
      return mapObject.get(field);
    }
  }

  saveProps() {
    this.updateSelectedNode();
  }
  updateSelectedNode() {
    let fildsValues: any = {};
    this.classFields.forEach((cf) => {
      if (cf.type == "boolean") {
        fildsValues[cf.field] = (<HTMLSelectElement>(
          document.getElementById(this.selectedNode?.node.item + "-" + cf.field)
        ))?.value;
      } else {
        fildsValues[cf.field] = (<HTMLInputElement>(
          document.getElementById(this.selectedNode?.node.item + "-" + cf.field)
        ))?.value;
      }
    });
    fildsValues["children"] = this.selectedNode?.node.props.children;
    fildsValues["hasChildren"] =
      this.selectedNode?.node.props.children != undefined &&
      this.selectedNode.node.props.children.length > 0;
    fildsValues["css"] = this.cssSelected;
    let parentNode =
      this.selectedNode!.node.level > 0
        ? this.getParentNode(this.selectedNode!.node)
        : null;
    fildsValues["parentKey"] = parentNode?.item;
    let newChanges = new ArticalControlBase<string>(fildsValues);
    console.log(
      "newChanges",
      newChanges,
      (<HTMLSelectElement>(
        document.getElementById(this.selectedNode?.node.item + "-required")
      ))?.value
    );
    //Updating Parent Pros.Children
    let currentNodeInparent = parentNode?.props?.children?.find(
      (v) => v.key == this.selectedNode?.node.item
    );
    if (currentNodeInparent == undefined) {
      parentNode?.props?.children?.push(newChanges);
    } else {
      parentNode?.props?.children?.forEach((cn) => {
        if (cn.key == this.selectedNode?.node.item) {
          cn = newChanges;
        }
      });
    }
    if (
      this.selectedNode?.node.props.children != undefined &&
      this.selectedNode.node.props.children.length > 0
    ) {
      this.selectedNode.node.props.children.forEach((v) => {
        v.parentKey = newChanges.key;
      });
    }
    //Updating Node.Children
    let childrenNodes =
      this.selectedNode!.node.level > 0
        ? this.getChildren(this.flatNodeMap.get(parentNode!)!)
        : null;
    childrenNodes?.forEach((cn) => {
      if (cn.item == this.selectedNode?.node.item) {
        cn.props = newChanges;
        cn.item = newChanges.key;
      }
    });

    this.selectedNode!.node.props = newChanges;
    this.selectedNode!.node.item = newChanges.key;
  }

  showCheckboxes() {
    this.updateSelectedNode();
    //var checkboxes = checkboxes
    if (!this.expanded) {
      this.chkStyle = "display: block";
      //checkboxes.style.display = "block";
      this.expanded = true;
    } else {
      this.chkStyle = "display: none";
      //checkboxes.style.display = "none";
      this.expanded = false;
    }
  }
  selectControl(e: MouseEvent, node: TodoItemFlatNode) {
    this.selectedNode = {
      node: node,
      isSelected: this.checklistSelection.isSelected(node),
    };
    console.log("this.selectedNode", this.selectedNode.node);
    let parent = document.querySelectorAll(".slected-node-cls");
    parent.forEach((ele) => {
      document.getElementById(ele.id)?.classList.remove("slected-node-cls");
    });
    (<HTMLInputElement>e.target).classList.add("slected-node-cls");

    // console.log(
    //   "this.selectedNode.node.props=>",
    //   JSON.stringify(this.selectedNode.node.props)
    // );
    //e.pageX will give you offset from left screen border
    //e.pageY will give you offset from top screen border

    //determine popup X and Y position to ensure it is not clipped by screen borders
    const popupHeight = 400, // hardcode these values
      popupWidth = 300; // or compute them dynamically

    let popupXPosition, popupYPosition;

    if (e.clientX + popupWidth > window.innerWidth) {
      popupXPosition = e.pageX - popupWidth;
    } else {
      popupXPosition = e.pageX;
    }

    if (e.clientY + popupHeight > window.innerHeight) {
      popupYPosition = e.pageY - popupHeight;
    } else {
      popupYPosition = e.pageY;
    }
    //this.propPosition = `top: ${popupYPosition - 50}px;`;

    //this.createFormGroup(this.selectedNode);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.selectedNode = {
      node: node,
      isSelected: !this.checklistSelection.isSelected(node),
    };
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  removeItem(node: TodoItemFlatNode) {
    if (this.selectedMenu != undefined) {
      let status = this.confirmMethod("Do you want to delete controls?");
      if (!status) {
        return;
      }
    }
    const parentNode = this.getParentNode(node);
    let parentFlat = this.flatNodeMap.get(parentNode!);
    // let propChildren = parentNode?.props?.children;
    if (parentNode! != null) {
      parentNode!.props.children = parentNode!.props.children?.filter(
        (v) => v.key != node.item
      );
    }
    if (parentFlat == undefined || parentFlat == null) {
      parentFlat = this.flatNodeMap.get(node);
    }
    this._database.deleteItem(parentFlat!, node.item!);
  }
  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, "");
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    console.log("saveNode", node, nestedNode, itemValue);
    this._database.updateItem(nestedNode!, itemValue);
  }
  // cancelNode(node: TodoItemFlatNode, itemValue: string){
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.deleteItem(parentNode!, "");
  // }

  get classFields() {
    let fields = new ArticalControlBase<string>();
    let values = Object.entries(fields);
    let pageFields: any[] = [];
    values.forEach((v) => pageFields.push({ field: v[0], type: typeof v[1] }));
    return pageFields;
  }
  get availableControls() {
    return ArticalControlBase.derived;
  }

  saveArticleByValidation(article?: Article) {
    this.route.queryParams.subscribe((params) => {
      let queryStringCode = params["code"];
      if (queryStringCode == undefined || queryStringCode == "") {
        return;
      }
      this.authorizeService.getAccessToken(queryStringCode).subscribe(
        (result: any) => {
          //console.log("access_token", result);
          this.saveArticle(result.access_token, article).subscribe(
            (result: any) => {
              if (result.statusCode == 200 || result.statusCode == 201) {
                this.statusMessage = {
                  message: "Artical saved successfully.",
                  color: "green",
                };
                this.previewUrl = "/preview";
              } else {
                console.log("Somthing went wrong!", result);
                this.statusMessage = {
                  message: "Somthing went wrong! status-code:" + result.status,
                  color: "red",
                };
              }
            }
          );
        },
        (err) => {
          console.log("Article save error", err);
          this.statusMessage = {
            message: "Please login to get active session.",
            color: "red",
          };
          this.needToLogin = true;
        }
      );
    });
  }
  saveArticle(token: string, article?: Article) {
    return this.articleService.addArticle(article!, token);
  }

  confirmMethod(name: string): boolean {
    if (confirm(name)) {
      console.log("Implement delete functionality here");
      return true;
    } else {
      return false;
    }
  }

  displayMessage(msg: any) {
    this.selectedMenu = msg;

    let nodes: TodoItemNode[] = [];
    let article = this.selectedMenu?.node.props as Article;
    console.log("this.selectedMenu.node.props", this.selectedMenu?.node.props);
    this.selectedNode = undefined;
    if (this.selectedMenu?.node.props) {
      article.controls!.forEach((ctrl) =>
        nodes.push(this.buildFileArticleTree(ctrl, 0))
      );
      console.log("nodes=>", nodes);
      this._database.dataChange.next(nodes);
    }
    localStorage.removeItem("selectedpage");
    //let tree = this._database.dataChange.next(nodes);
  }

  loadDefault() {
    let status = this.confirmMethod(
      "Do you want to load default page controls?"
    );
    if (!status) {
      return;
    }
    this.articleService.getQuestions().subscribe((v) => {
      //console.log(JSON.stringify(v));

      let nodes: TodoItemNode[] = [];
      v.forEach((ctrl) => nodes.push(this.buildFileArticleTree(ctrl, 0)));
      console.log("nodes=>", nodes);
      let tree = this._database.dataChange.next(nodes);

      console.log("tree", tree);
    });
  }
  articleTree: TodoItemNode[] = [];
  buildFileArticleTree(
    crtl: ArticalControlBase<string>,
    level: number
  ): TodoItemNode {
    const value = crtl;
    const node = new TodoItemNode();
    node.item = value.key;
    node.props = value;

    if (value != null) {
      //if (typeof value === "object") {
      if (
        value.hasChildren &&
        value.children != undefined &&
        value.children?.length > 0
      ) {
        value.children.forEach((child) => {
          if (node.children == undefined) {
            node.children = [];
          }
          node.children.push(this.buildFileArticleTree(child, level + 1));
        });

        //node.children = this.buildFileArticleTree(value.children, level + 1);
      } else {
        node.item = value.key;
        node.props = value;
      }
    }
    return node;
  }
}
