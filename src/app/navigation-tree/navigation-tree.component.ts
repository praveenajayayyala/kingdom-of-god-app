import { Observable } from "rxjs/internal/Observable";
import { QuestionService } from "../question.service";
import { QuestionBase } from "../controls/question-base";
import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injectable,
  Output,
} from "@angular/core";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { BehaviorSubject } from "rxjs";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { Article } from "../modal/article";
import { ArticleService } from "../artical.service";
import { AuthorizeService } from "../authorize.service";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
/**
 * Node for to-do item
 */
export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
  props!: Article;
  order!: number;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
  props!: Article;
  order!: number;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  "Kingdom-Of-God": {
    // Home: ["XXX"],
    // About: ["XXX"],
    // "Contact-us": ["XXX"],
    // Articals: {
    //   Latest: ["XXX"],
    //   Songs: { Telugu: ["XXX"], Hindi: ["XXX"] },
    //   "Video-Massages": ["XXX"],
    // },
  },
  // Reminders: [
  //   'Cook dinner',
  //   'Read the Material Design spec',
  //   'Upgrade Application to Angular',
  // ],
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
    //const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    //this.dataChange.next(data);
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
    article: Article,
    level: number,
    listArticle: Map<string, Article[]>
  ): TodoItemNode {
    const value = article;
    const node = new TodoItemNode();
    node.item = value.name!;
    node.props = value;
    node.order = value.order!;

    if (value != null) {
      //if (typeof value === "object") {
      if (
        listArticle.get(value.name!) &&
        listArticle.get(value.name!) != undefined &&
        listArticle.get(value.name!)?.length! > 0
      ) {
        listArticle.get(value.name!)?.forEach((child) => {
          if (node.children == undefined) {
            node.children = [];
          }
          node.children.push(
            this.buildFileArticleTree(child, level + 1, listArticle)
          );
        });

        //node.children = this.buildFileArticleTree(value.children, level + 1);
      } else {
        node.item = value.name!;
        node.props = value;
        node.order = value.order!;
      }
    }
    return node;
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
    selector: "app-navigation-tree",
    templateUrl: "./navigation-tree.component.html",
    styleUrls: ["./navigation-tree.component.css"],
    providers: [ChecklistDatabase],
    standalone: false
})
export class NavigationTreeComponent implements AfterViewChecked {
  @Output() messageEvent = new EventEmitter<any>();
  needToLogin: boolean = this.authorizeService.neetToLogin;
  questions$: Observable<QuestionBase<any>[]>;
  statusMessage: string = "";
  statusMsgColor: string = "red";
  selectedNode!: { node: TodoItemFlatNode; isSelected: boolean };
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
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private authorizeService: AuthorizeService,
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
    // this.crtlsTreeControl = new FlatTreeControl<TodoItemFlatNode>(
    //   this.getLevel,
    //   this.isExpandable
    // );
    this.loadMenu();
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
      if (localStorage.getItem("selectedpage") != null) {
        let selectedNode: TodoItemFlatNode = JSON.parse(
          localStorage.getItem("selectedpage") + ""
        );
        this.selectManu(new MouseEvent(selectedNode.item), selectedNode);
      }
    });
    this.questions$ = service.getQuestions();

    this.treeControl.expandAll();
  }
  ngAfterViewChecked(): void {
    this.treeControl.dataNodes.forEach((d) => this.deleteDefault(d));
    this.ref.detectChanges();
  }
  ngAfterViewInit(): void {
    //this.treeControl.dataNodes.forEach((d) => this.deleteDefault(d));
  }

  deleteDefault = (node: TodoItemFlatNode) => {
    if (node.item == "XXX") {
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
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.props = node.props;
    flatNode.order = node.order;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

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
  saveArticle() {
    this.selectedNode.node.props = new Article({
      name: (<HTMLInputElement>document.getElementById("article-name"))?.value,
      id: (<HTMLInputElement>document.getElementById("article-id"))?.value,
      isActive:
        (<HTMLInputElement>document.getElementById("article-isActive"))
          ?.value == "true",
      pageTitle: (<HTMLInputElement>(
        document.getElementById("article-pageTitle")
      ))?.value,
      order: Number.parseInt(
        (<HTMLInputElement>document.getElementById("article-order"))?.value
      ),
      parent: (<HTMLInputElement>document.getElementById("article-parent"))
        ?.value,
    });
    this.selectedNode.node.item = (<HTMLInputElement>(
      document.getElementById("article-name")
    ))?.value;
  }
  selectManu(e: MouseEvent, node: TodoItemFlatNode) {
    this.selectedNode = {
      node: node,
      isSelected: this.checklistSelection.isSelected(node),
    };

    let parent = document.querySelectorAll(".slected-menu-cls");
    parent.forEach((ele) => {
      document.getElementById(ele.id)?.classList.remove("slected-menu-cls");
    });

    if (e.target != undefined) {
      (<HTMLInputElement>e.target).classList.add("slected-menu-cls");
    } else {
      if (document.getElementById(node.item)) {
        document.getElementById(node.item)?.classList.add("slected-menu-cls");
      }
    }
    this.messageEvent.emit(this.selectedNode);
  }
  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.selectedNode = {
      node: node,
      isSelected: !this.checklistSelection.isSelected(node),
    };
    this.messageEvent.emit(this.selectedNode);
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.selectedNode = {
      node: node,
      isSelected: !this.checklistSelection.isSelected(node),
    };
    this.messageEvent.emit(this.selectedNode);
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
    const parentNode = this.getParentNode(node);
    const parentFlat = this.flatNodeMap.get(parentNode!);
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
    //nestedNode?.children.push({item: ""} as TodoItemNode)
    this._database.updateItem(nestedNode!, itemValue);
    //this.treeControl.dataNodes.forEach((d) => this.deleteDefault(d));
  }

  loadMenu() {
    this.route.queryParams.subscribe((params) => {
      let queryStringCode = params["code"];
      if (queryStringCode == undefined || queryStringCode == "" || queryStringCode.length < 24) {
        this.statusMessage = "Please login to proceed!";
        localStorage.removeItem('selectedpage');
        return;
      }
      this.articleService.getArticlesByPostId("*").then((pages) => {
        const groupedMap = pages.reduce(
          (entryMap, e) =>
            entryMap.set(e.parent, [...(entryMap.get(e.parent) || []), e]),
          new Map()
        );
        //groupedMap.forEach((v, k) => console.log("groupedMap", k, v));
        let nodes: TodoItemNode[] = [];
        groupedMap.get("").forEach((article: Article) => {
          nodes.push(
            this._database.buildFileArticleTree(article, 0, groupedMap)
          );
        });
        nodes = nodes.sort(function (a, b) {
          return a.order - b.order;
        });
        //console.log("pages=>", pages, nodes);
        this._database.dataChange.next(nodes);
        this.treeControl.expandAll();
      });
    });
  }
}
