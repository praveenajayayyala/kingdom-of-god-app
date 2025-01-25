import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import {
  ChecklistDatabase,
  TodoItemFlatNode,
  TodoItemNode,
} from "../admin/admin.component";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from "@angular/material/tree";
import { map, Observable } from "rxjs";
import { QuestionBase } from "../controls/question-base";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import { ArticleService } from "../artical.service";
import { AuthorizeService } from "../authorize.service";
import { Article } from "../modal/article";
import { QuestionService } from "../question.service";
import unescapeJs from "unescape-js";
import { DivControl } from "../artical-controls/control-div";
import { HeaderControl } from "../artical-controls/control-header";
import { MarkdownControl } from "../artical-controls/control-markdown";
import { SharedService } from "../shared-service";

@Component({
  selector: "app-page-builder",
  templateUrl: "./page-builder.component.html",
  styleUrl: "./page-builder.component.css",
  providers: [ChecklistDatabase],
  standalone: false,
})
export class PageBuilderComponent implements OnInit, AfterViewInit {
  needToLogin: boolean = this.authorizeService.neetToLogin;
  questions$!: Observable<QuestionBase<any>[]>;
  statusMessage = { message: "", color: "" };
  crtlStatusMessage = { message: "", color: "" };
  selectedNode?: { node: TodoItemFlatNode; isSelected: boolean };
  selectedMenu?: { node: TodoItemFlatNode; isSelected: boolean };
  selectedNodeItem: string = "";
  selectedArticle?: Article;
  propPosition: string = "top: 45px;";

  expanded = false;
  chkStyle = "display: none";
  cssSelected = "";
  togglePreviewText = "Open Preview";
  //articalControls: ArticalControlBase<string>[] = [];
  previewUrl = "";
  // constructor() {

  treeControl!: FlatTreeControl<TodoItemFlatNode>;

  //crtlsTreeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener!: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource!: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  @Output() updateMarkdownEvent = new EventEmitter<string>();
  content = "";

  constructor(
    private _database: ChecklistDatabase,
    private shareService: SharedService,
    private articleService: ArticleService,
    private authorizeService: AuthorizeService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    // _database.dataChange.subscribe((data) => {
    //   this.dataSource.data = data;
    // });
    this.shareService.updateBackgroundColor("#6c757d");
  }
  ngAfterViewInit(): void {
    if (
      localStorage.getItem("articleReadytoSave") != null &&
      localStorage.getItem("articleReadytoSave") != ""
    ) {
      // console.log(
      //   "articleReadytoSave",
      //   JSON.parse(localStorage.getItem("articleReadytoSave")!)
      //);
      this.selectedArticle = JSON.parse(
        localStorage.getItem("articleReadytoSave")!
      );
      this.content = this.unwrapArticle(this.selectedArticle?.content!);
      this.updateMarkdownEvent.emit(this.content);
    }
  }

  ngOnInit(): void {}

  updateCache(article?: Article) {
    localStorage.setItem("articleReadytoSave", JSON.stringify(article));
  }

  saveSelectedArticle() {
    this.selectedArticle = new Article({
      name: (<HTMLInputElement>document.getElementById("article-name"))?.value,
      id: (<HTMLInputElement>document.getElementById("article-id"))?.value,
      isActive:
        (<HTMLInputElement>document.getElementById("article-isActive"))
          ?.value == "true",
      pageTitle: (<HTMLInputElement>(
        document.getElementById("article-pageTitle")
      ))?.value,
      pageBackImg: (<HTMLInputElement>(
        document.getElementById("article-pageBackImg")
      ))?.value,
      order: Number.parseInt(
        (<HTMLInputElement>document.getElementById("article-order"))?.value
      ),
      parent: (<HTMLInputElement>document.getElementById("article-parent"))
        ?.value,
    });
    this.selectedArticle!.name = (<HTMLInputElement>(
      document.getElementById("article-name")
    ))?.value;
  }

  wrapArticle(article: Article): string {
    let articleCrtls: ArticalControlBase<string>[] = [];
    articleCrtls.push(
      new ArticalControlBase<string>(
        new DivControl({
          key: "jumbotron-container",
          parentKey: "",
          css: "container",
          row: 1,
          hasChildren: true,
          order: 1,
        })
      )
    );
    articleCrtls.push(
      new ArticalControlBase<string>(
        new HeaderControl({
          key: "article-header",
          label: article.pageTitle,
          order: 2,
          row: 2,
          column: 1,
          src: article.pageBackImg,
          parentKey: "jumbotron-container",
        })
      )
    );
    articleCrtls.push(
      new ArticalControlBase<string>(
        new MarkdownControl({
          key: "article-markdown",
          label: article.content,
          order: 3,
          row: 3,
          column: 1,
          parentKey: "jumbotron-container",
        })
      )
    );
    return JSON.stringify(articleCrtls);
  }

  unwrapArticle(content: string): string {
    if (content == null || content == "") {
      return "";
    }
    let artcleCnt = JSON.parse(content) as ArticalControlBase<string>[];
    return unescapeJs(
      artcleCnt.find((art) => art.key == "article-markdown")?.label + ""
    );
  }

  saveArticle($pageContent: any) {
    this.saveSelectedArticle();
    this.selectedArticle!.content = this.articleService.escapeJson(
      $pageContent
    );
    this.selectedArticle!.content = this.wrapArticle(this.selectedArticle!);
    this.selectedArticle!.controls = JSON.parse(
      this.wrapArticle(this.selectedArticle!)
    );
    this.saveArticleByValidation(this.selectedArticle);
  }

  saveArticleToAWS(token: string, article?: Article) {
    return this.articleService.addArticle(article!, token);
  }

  saveArticleByValidation(article?: Article) {
    this.updateCache(article); //CACHE IT
    this.route.queryParams.subscribe((params) => {
      let queryStringCode = params["code"];
      if (queryStringCode == undefined || queryStringCode == "") {
        return;
      }
      this.authorizeService
        .getAccessToken(queryStringCode, environment.redirecPBtUrl)
        .subscribe(
          (result: any) => {
            //console.log("access_token", result);
            this.saveArticleToAWS(result.access_token, article).subscribe(
              (result: any) => {
                if (result.statusCode == 200 || result.statusCode == 201) {
                  this.statusMessage = {
                    message: "Artical saved successfully.",
                    color: "green",
                  };
                  localStorage.removeItem("articleReadytoSave");
                } else {
                  //console.log("Somthing went wrong!", result);
                  this.statusMessage = {
                    message:
                      "Somthing went wrong! status-code:" + result.status,
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

  get loginUrl() {
    return environment.loginPBUrl;
  }

  get logoutUrl() {
    return environment.logoutUrl;
  }

  displayMessage(msg: any) {
    this.selectedMenu = msg;

    let nodes: TodoItemNode[] = [];
    let article = this.selectedMenu?.node.props as Article;
    //console.log("this.selectedMenu.node.props", this.selectedMenu?.node.props);
    this.selectedNode = undefined;
    if (this.selectedMenu?.node.props) {
      this.selectedArticle = this.selectedMenu?.node.props;
      this.content = this.unwrapArticle(this.selectedArticle?.content!);
      this.updateMarkdownEvent.emit(this.content);
      article.controls!.forEach((ctrl: any) =>
        nodes.push(this.buildFileArticleTree(ctrl, 0))
      );
      //console.log("nodes=>", nodes);
      this._database.dataChange.next(nodes);
    }
    localStorage.removeItem("articleReadytoSave");
    //let tree = this._database.dataChange.next(nodes);
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
