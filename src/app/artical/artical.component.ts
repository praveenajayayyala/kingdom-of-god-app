import { Component, OnInit } from "@angular/core";
import { ArticleService } from "../artical.service";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
    selector: "app-artical",
    templateUrl: "./artical.component.html",
    styleUrls: ["./artical.component.css"],
    standalone: false
})
export class ArticalComponent implements OnInit {
  articalControls$: ArticalControlBase<string>[] = [];
  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}
  ngOnInit(): void {
    this.articleService.articals.subscribe((arts) => {
      this.route.queryParams.subscribe((params) => {
        let queryStringCode = params["postId"];
        let pageArticles = arts.find((v) => v.name?.toLowerCase() == 'article');
        if (queryStringCode != undefined) {
          pageArticles = arts.find((v) => v.id ==  queryStringCode);
        }        
        this.titleService.setTitle(pageArticles?.pageTitle!);
        this.articalControls$ = pageArticles?.controls!;
      });
    });
  }
}
