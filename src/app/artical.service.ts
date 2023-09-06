import { Injectable } from "@angular/core";
import { catchError, of, retry } from "rxjs";
import { ArticalControlBase } from "./artical-controls/artical-control-base";
import { DropdownControl } from "./artical-controls/control-dropdown";
import { TextboxControl } from "./artical-controls/control-textbox";
import { DivControl } from "./artical-controls/control-div";
import { ImageControl } from "./artical-controls/control-img";
import { CardBasicControl } from "./artical-controls/control-card";
import { LabelControl } from "./artical-controls/control-label";
import { H1Control } from "./artical-controls/control-h1";
import { PeraControl } from "./artical-controls/control-pera";
import { BRControl } from "./artical-controls/control-br";
import { CardOfArticalControl } from "./artical-controls/control-card-artical";
import { H3Control } from "./artical-controls/control-h3";
import { HttpClient } from "@angular/common/http";
import * as $ from "jquery";
import { Article } from "./modal/article";
import { SpanControl } from "./artical-controls/control-span";

@Injectable()
export class ArticalService {
  constructor(private http: HttpClient) {}
  baseUrl = "https://so926lyyic.execute-api.ap-south-1.amazonaws.com/prod";
  controls: ArticalControlBase<string>[] = [];
  ControlsByPostId: ArticalControlBase<string>[] = [];
  controlsByParentKey = new Map<string, ArticalControlBase<string>[]>();

  public getArticleById(id: string, options?: any) {
    return this.http
      .get(this.baseUrl + "/getarticles?postId=" + id, options)
      .pipe(retry(2));
  }

  public getValidate() {
    return this.http.post(
      "https://kingdomofgod.auth.ap-south-1.amazoncognito.com/login?response_type=codeclient_id=vclkssn2ftril9vhgbscnc46r&redirect_uri=http://localhost:4200/admin/",
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  public addArticle(article: Article, token: string) {
    return this.http.post(
      this.baseUrl + "/addarticle",
      { "body-json": article },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
  }

  async getArticlesByPostId(postId: string) {
    return await new Promise<ArticalControlBase<string>[]>((resolve) => {
      this.getArticleById(postId, {
        headers: {
          "Content-Type": "application/json",
        },
      }).subscribe((response: any) => {
        let body: any = JSON.parse(response.body);
        let controlsByPostId :ArticalControlBase<string>[]=[]; 

        body.forEach((v: any) => {
          if (v.content != undefined) {
            //console.log("id:", v.id, JSON.parse(v.content));
            JSON.parse(v.content).forEach((c: ArticalControlBase<string>) => {
              controlsByPostId.push(this.getTansilateJSONToControl(c));
            });
          }
        });

        this.mapControlsBasedOnParentKey(controlsByPostId).subscribe(
          (v) => {
            resolve(v);
          }
        );
      });
    });
  }
  
  getTansilateJSONToControl(control: ArticalControlBase<string>) {
    let result: any = null;
    switch (control.controlType) {
      case "div":
        result = new DivControl(control);
        break;
      case "br":
        result = new BRControl(control);
        break;
      case "card-artical":
        result = new CardOfArticalControl(control);
        break;
      case "card-basic":
        result = new CardBasicControl(control);
        break;
      case "dropdown":
        result = new DropdownControl(control);
        break;
      case "h1":
        result = new H1Control(control);
        break;
      case "h3":
        result = new H3Control(control);
        break;
      case "image":
        result = new ImageControl(control);
        break;
      case "label":
        result = new LabelControl(control);
        break;
      case "pera":
        result = new PeraControl(control);
        break;
      case "span":
        result = new SpanControl(control);
        break;
      case "textbox":
        result = new TextboxControl(control);
        break;
    }
    return result;
  }

  mapControlsBasedOnParentKey(controls: ArticalControlBase<string>[]) {
    let controlsByParentKey = new Map<string, ArticalControlBase<string>[]>();
    for (var i = 0; i < controls.length; i++) {
      var key = controls[i].parentKey;
      var value = controls[i];

      if (controlsByParentKey.get(key) != null) {
        controlsByParentKey.get(key)?.push(value);
      } else {
        controlsByParentKey.set(key, [value]);
      }
    }
    controls.forEach((crtl) => {
      if (controlsByParentKey.get(crtl.key)) {
        crtl.children = controlsByParentKey.get(crtl.key);
      }
    });

    return of(
      controls
        ?.filter((v) => v.parentKey == "")
        .sort((a, b) => a.order - b.order)
    );
  }

  // TODO: get from a remote source of question metadata
  getQuestions() {
    //this.getArticlesByPostId("1003");
    this.controls = [
      new DivControl({
        key: "jumbotron-Row",
        css: "jumbotron feature",
        backGroundColor: "#337ab7",
        row: 1,
        order: 1,
        hasChildren: true,
      }),
      new DivControl({
        key: "jumbotron-container",
        parentKey: "jumbotron-Row",
        css: "container",
        row: 2,
        hasChildren: true,
        order: 2,
      }),
      new H1Control({
        key: "jumbotron-h1",
        parentKey: "jumbotron-container",
        label: "Kingdom Of God",
        row: 2,
        order: 3,
      }),
      new BRControl({
        key: "jumbotron-h1-br1",
        parentKey: "jumbotron-container",
        row: 2,
        order: 4,
      }),
      new BRControl({
        key: "jumbotron-h1-br2",
        parentKey: "jumbotron-container",
        label: "Kingdom Of God",
        row: 2,
        order: 5,
      }),
      new DivControl({
        key: "container-main",
        css: "container-main",
        row: 2,
        hasChildren: true,
        order: 6,
      }),
      new DivControl({
        key: "main-container",
        css: "container",
        row: 2,
        parentKey: "container-main",
        hasChildren: true,
        order: 6,
      }),
      new DivControl({
        key: "main-container-row1",
        css: "row",
        parentKey: "main-container",
        row: 2,
        hasChildren: true,
        order: 7,
      }),
      new DivControl({
        key: "main-container-col1",
        css: "col-lg-12",
        parentKey: "main-container-row1",
        hasChildren: true,
        row: 2,
        order: 8,
      }),
      new H1Control({
        key: "main-container-col1-h1",
        parentKey: "main-container-col1",
        label: "Superior Collaboration",
        css: "page-header",
        row: 2,
        order: 9,
      }),
      new PeraControl({
        key: "main-container-col1-h1",
        parentKey: "main-container-col1",
        label:
          "Proactively envisioned multimedia based expertise and cross-media growth strategies. Seamlessly visualize quality intellectual capital without superior collaboration and idea-sharing. Holistically pontificate installed base portals after maintainable products.",
        row: 2,
        order: 10,
      }),
      new BRControl({
        key: "main-container-col1-br2",
        parentKey: "main-container-col1",
        row: 2,
        order: 11,
      }),
      new BRControl({
        key: "main-container-col1-br3",
        parentKey: "main-container-col1",
        row: 2,
        order: 12,
      }),
      new DivControl({
        key: "main-container-row2",
        css: "row",
        parentKey: "main-container",
        hasChildren: true,
        row: 2,
        order: 13,
      }),
      new DivControl({
        key: "main-container-row2-col1",
        css: "col-md-4 article-intro",
        parentKey: "main-container-row2",
        hasChildren: true,
        row: 2,
        order: 14,
      }),
      new DivControl({
        key: "main-container-row2-col1-row",
        css: "row article-intro-row",
        parentKey: "main-container-row2-col1",
        label: "Bible reading",
        hasChildren: true,
        order: 15,
      }),
      new CardOfArticalControl({
        key: "card-1",
        parentKey: "main-container-row2-col1-row",
        label: "Bible reading",
        type: "image",
        order: 16,
        src: "https://www.calvary-ag.net/bible.jpg",
      }),
      new H3Control({
        key: "main-container-row2-col1-h3",
        parentKey: "main-container-row2-col1-row",
        label: "The Bible",
        type: "image",
        order: 17,
      }),
      new PeraControl({
        key: "main-container-row2-col1-h3",
        parentKey: "main-container-row2-col1-row",
        label:
          "The Bible is God's message of rescue and reconciliation for everyone. It is an accurate picture of who God is and the good things he has in store for us. The Bible reveals God's principles for a life of faith, behavior, and healthy relationships.",
        order: 18,
      }),
      new DivControl({
        key: "main-container-row2-col2-row",
        css: "row article-intro-row",
        parentKey: "main-container-row2-col1",
        hasChildren: true,
        order: 19,
      }),
      new CardOfArticalControl({
        key: "card-2",
        parentKey: "main-container-row2-col2-row",
        label: "Public",
        type: "image",
        order: 20,
        src: "https://www.calvary-ag.net/people.jpg",
      }),
      new H3Control({
        key: "main-container-row2-col2-row-h3",
        parentKey: "main-container-row2-col2-row",
        label: "People",
        type: "image",
        order: 17,
      }),
      new PeraControl({
        key: "main-container-row2-col2-row-p",
        parentKey: "main-container-row2-col2-row",
        label:
          "Originally created perfect by God, human beings disobeyed Him. This brought sin, sickness, and death upon the human race. God is passionate to rescue and restore us from the pain and suffering we experience.",
        order: 18,
      }),
      new DivControl({
        key: "main-container-row2-col3-row",
        css: "row article-intro-row",
        parentKey: "main-container-row2-col1",
        hasChildren: true,
        order: 19,
      }),
      new CardOfArticalControl({
        key: "card-3",
        parentKey: "main-container-row2-col3-row",
        label: "God's work",
        order: 21,
        src: "https://www.calvary-ag.net/C.jpg",
      }),
      new H3Control({
        key: "main-container-row2-col1-h3",
        parentKey: "main-container-row2-col3-row",
        label: "Jesus Christ",
        type: "image",
        order: 17,
      }),
      new PeraControl({
        key: "main-container-row2-col1-h3",
        parentKey: "main-container-row2-col3-row",
        label:
          "He has always been fully God and always will be. Jesus also became a man to rescue us from our failures and painful experiences. He willingly died on a cross to remove our sin and offer eternal life. After his death, He rose from the dead, providing a new life for all who trust in Him.",
        order: 18,
      }),
      new DivControl({
        key: "last-jumbotron-Row",
        css: "jumbotron feature",
        backGroundColor: "rgb(114 143 115)",
        row: 1,
        order: 18,
        hasChildren: true,
      }),
      new DivControl({
        key: "last-jumbotron-container",
        parentKey: "last-jumbotron-Row",
        css: "container",
        row: 2,
        hasChildren: true,
        order: 2,
      }),
      new DivControl({
        key: "last-jumbotron-container-container-row2",
        css: "row",
        parentKey: "last-jumbotron-container",
        hasChildren: true,
        row: 2,
        order: 13,
      }),
      new DivControl({
        key: "last-jumbotron-container-container-row2-container-row2-col1",
        css: "col-md-3 article-intro",
        parentKey: "last-jumbotron-container-container-row2",
        hasChildren: true,
        row: 2,
        order: 14,
      }),
      new DivControl({
        key:
          "last-jumbotron-container-container-row2-container-row2-col1-container-row2-col1-row",
        css: "row article-intro-row",
        parentKey:
          "last-jumbotron-container-container-row2-container-row2-col1",
        label: "Bible reading",
        hasChildren: true,
        order: 15,
      }),
      new H3Control({
        key:
          "last-jumbotron-container-container-row2-container-row2-col1-container-row2-col1-row-h3",
        parentKey:
          "last-jumbotron-container-container-row2-container-row2-col1-container-row2-col1-row",
        label: "Jesus Christ",
        type: "image",
        order: 17,
      }),
      new PeraControl({
        key:
          "last-jumbotron-container-container-row2-container-row2-col1-container-row2-col1-row-p",
        parentKey:
          "last-jumbotron-container-container-row2-container-row2-col1-container-row2-col1-row",
        label:
          "He has always been fully God and always will be. Jesus also became a man to rescue us from our failures and painful experiences. He willingly died on a cross to remove our sin and offer eternal life. After his death, He rose from the dead, providing a new life for all who trust in Him.",
        order: 18,
      }),
      /*new DivControl({
        key: 'first-Row',
        css: 'row',
        row: 1,
        order: 1,
        hasChildren: true,
      }),
      new DivControl({
        key: 'second-Row',
        parentKey: 'first-Row',
        css: 'row',
        row: 2,
        hasChildren: true,
        order: 2,
      }),
      new ImageControl({
        key: 'logo',
        parentKey: 'second-Row',
        label: 'Phone',
        type: 'image',
        order: 3,
        src: 'https://www.calvary-ag.net/C.jpg',
      }),
      new DivControl({
        key: 'cards-Row',
        parentKey: 'first-Row',
        css: 'col-md-4',
        row: 2,
        hasChildren: true,
        order: 2,
      }),
      new CardControl({
        key: 'logo-1',
        parentKey: 'cards-Row',
        label: 'Phone',
        type: 'image',
        order: 3,
        src: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      }),
      new CardControl({
        key: 'logo-2',
        parentKey: 'cards-Row',
        label: 'Phone',
        type: 'image',
        order: 3,
        src: 'https://www.calvary-ag.net/C.jpg',
      }),
      new CardControl({
        key: 'logo-3',
        parentKey: 'cards-Row',
        label: 'Phone',
        type: 'image',
        order: 3,
        src: 'https://www.calvary-ag.net/C.jpg',
      }),
      new DivControl({
        key: 'third-Row',
        parentKey: 'first-Row',
        css: 'col-md-4',
        row: 3,
        hasChildren: true,
        order: 2,
      }),

      new DropdownControl({
        key: 'brave',
        parentKey: 'third-Row',
        label: 'Bravery Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' },
        ],
        value: 'good',
        order: 5,
      }),
      new TextboxControl({
        key: 'firstName',
        parentKey: 'third-Row',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 4,
      }),
      new DivControl({
        key: 'last-Row',
        parentKey: 'first-Row',
        css: 'row col-lg-12',
        row: 2,
        hasChildren: true,
        order: 2,
      }),
      new LabelControl({
        key: 'firstName',
        parentKey: 'last-Row',
        label: 'First name',
        value: 'Hello Lucky',
        required: true,
        order: 4,
      }),
      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' },
        ],
        order: 3,
      }),

      new DropdownQuestion({
        key: 'gender',
        label: 'Gender',
        options: [
          { key: 'male', value: 'Male' },
          { key: 'female', value: 'Female' },
        ],
        order: 4,
      }),
      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1,
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2,
      }),
      new TextboxQuestion({
        key: 'phonecontact',
        label: 'Phone',
        type: 'text',
        order: 5,
      }),
      new ImageQuestion({
        key: 'phonecontact',
        label: 'Phone',
        type: 'image',
        order: 5,
        src: 'https://www.calvary-ag.net/C.jpg',
      }),*/
    ];
    return this.mapControlsBasedOnParentKey(this.controls);
    // this.controlsByParentKey = new Map<string, ArticalControlBase<string>[]>();
    // for (var i = 0; i < this.controls.length; i++) {
    //   var key = this.controls[i].parentKey;
    //   var value = this.controls[i];

    //   if (this.controlsByParentKey.get(key) != null) {
    //     this.controlsByParentKey.get(key)?.push(value);
    //   } else {
    //     this.controlsByParentKey.set(key, [value]);
    //   }
    // }
    // this.controls.forEach((crtl) => {
    //   if (this.controlsByParentKey.get(crtl.key)) {
    //     crtl.children = this.controlsByParentKey.get(crtl.key);
    //   }
    // });
    // console.log("this.controls=> ", JSON.stringify(this.controls));
    // return of(
    //   this.controls
    //     ?.filter((v) => v.parentKey == "")
    //     .sort((a, b) => a.order - b.order)
    // );
  }
  getChildrenControls(parentKey: string) {
    return this.controlsByParentKey.get(parentKey);
  }
}
