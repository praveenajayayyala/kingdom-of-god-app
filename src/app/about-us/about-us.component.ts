import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ArticalControlBase } from '../artical-controls/artical-control-base';
import { ArticleService } from '../artical.service';
import { Article } from '../modal/article';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.css'],
    standalone: false
})
export class AboutUsComponent implements OnInit {
  articles: Article[]=[];
  header: ArticalControlBase<string> | undefined;
  formStyle: string | undefined;
  footerStyle: string | undefined;
  constructor(private articleService: ArticleService,  private titleService: Title) {
  }
  articalControls$: ArticalControlBase<string>[] = [];
  ngOnInit(): void {
    this.articleService.articals.subscribe((arts) => {
      this.articles = arts;
      let pageArticles = arts.find((v) => v.name?.toLowerCase() == "about-us");
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
  }
}
