import { Component, OnInit } from '@angular/core';
import { Article } from '../modal/article';
import { ArticleService } from '../artical.service';
import { Title } from '@angular/platform-browser';
import { ArticalControlBase } from '../artical-controls/artical-control-base';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css'],
    standalone: false
})
export class ContactUsComponent implements OnInit {
  articles: Article[]=[];
  constructor(private articleService: ArticleService,  private titleService: Title) {
  }
  articalControls$: ArticalControlBase<string>[] = [];
  ngOnInit(): void {
    this.articleService.articals.subscribe((arts) => {
      this.articles = arts;
      let pageArticles = arts.find((v) => v.name?.toLowerCase() == "contact-us");
      this.titleService.setTitle(pageArticles?.pageTitle!);
      this.articalControls$ = pageArticles?.controls!;
    });
  }
}
