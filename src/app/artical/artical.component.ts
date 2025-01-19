import { Component, OnInit } from "@angular/core";
import { ArticleService } from "../artical.service";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { SharedService } from "../shared-service";

@Component({
  selector: "app-artical",
  templateUrl: "./artical.component.html",
  styleUrls: ["./artical.component.css"],
  standalone: false,
})
export class ArticalComponent implements OnInit {
  articalControls$: ArticalControlBase<string>[] = [];
  header: ArticalControlBase<string> | undefined;
  formStyle: string | undefined;
  footerStyle: string | undefined;
  currentYear!: Date;
  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private titleService: Title,
    private shareService: SharedService
  ) {}
  ngOnInit(): void {
    //this.shareService.updateBackgroundColor("transparent");//Change color of Nav dynamically
    this.articleService.articals.subscribe((arts) => {
      this.route.queryParams.subscribe((params) => {
        let queryStringCode = params["postId"];
        let pageArticles = arts.find((v) => v.name?.toLowerCase() == "article");
        if (queryStringCode != undefined) {
          pageArticles = arts.find((v) => v.id == queryStringCode);
        }
        this.titleService.setTitle(pageArticles?.pageTitle!);
        this.articalControls$ = pageArticles?.controls!;
        if (this.articalControls$ != undefined) {
          this.articalControls$.forEach((crtl) => {
            this.header = crtl.children?.filter(
              (child) => child.controlType == "header"
            )[0];
            this.formStyle = "top: -160px; position: relative;";
            this.footerStyle = "top: -130px; position: relative;";
          });
        }
      });
    });
    this.currentYear = new Date();
  }
}
