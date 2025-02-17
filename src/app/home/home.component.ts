import { Component, OnInit } from "@angular/core";
import { ArticleService } from "../artical.service";
import { Article } from "../modal/article";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { Title } from "@angular/platform-browser";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
    standalone: false
})
export class HomeComponent implements OnInit {
  articles: Article[] = [];
  constructor(
    private articleService: ArticleService,
    private titleService: Title
  ) {}
  articalControls$: ArticalControlBase<string>[] = [];
  header: ArticalControlBase<string> | undefined;
  formStyle: string | undefined;
  footerStyle: string | undefined;
  ngOnInit(): void {
    this.articleService.articals.subscribe((arts) => {
      this.articles = arts;
      let pageArticles = arts.find((v) => v.name?.toLowerCase() == "home");
      this.titleService.setTitle(pageArticles?.pageTitle!);
      this.articalControls$ = pageArticles?.controls!;

      if (this.articalControls$ != undefined) {
        this.articalControls$.forEach((crtl) => {
          this.header = crtl.children?.filter(
            (child) => child.controlType == "header"
          )[0];
        });
        this.formStyle = "top: -160px; position: relative;";
        this.footerStyle = "top: -130px; position: relative;";
      }
    });
  }
}
