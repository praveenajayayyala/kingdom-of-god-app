import { Component, OnInit } from "@angular/core";
import { ArticleService } from "../artical.service";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Article } from "../modal/article";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Injectable()
export class DataSharingService {
  public articalControls: BehaviorSubject<
    ArticalControlBase<string>[]
  > = new BehaviorSubject<ArticalControlBase<string>[]>([]);
}

@Component({
  selector: "app-artical",
  templateUrl: "./artical.component.html",
  styleUrls: ["./artical.component.css"],
  providers: [DataSharingService],
})
export class ArticalComponent implements OnInit {
  articalControls$: ArticalControlBase<string>[] = [];
  constructor(
    private service: ArticleService,
    private dataSharingService: DataSharingService,
    private route: ActivatedRoute,
    private titleService:Title
  ) {

    this.route.queryParams.subscribe((params) => {
      let queryStringCode = params["postId"];
      if (queryStringCode == undefined || queryStringCode == "") {
        return;
      }
      this.service.getArticlesByPostId(queryStringCode).then((ctrls: Article[]) => {
        console.log("going to call next", ctrls);
        if (ctrls != undefined && ctrls != null && ctrls.length > 0) {
          let pageTitle = ctrls.at(0)?.pageTitle! ?? "Kingdom Of God"
          this.titleService.setTitle(pageTitle);
          this.dataSharingService.articalControls.next(ctrls.at(0)?.controls!);
        }
      });
    });
  }
  ngOnInit(): void {
    this.dataSharingService.articalControls.subscribe((value) => {
      console.log("going to subscribe next", value);
      this.articalControls$ = value;
    });
  }
  // get articalControls() {
  //   this.dataSharingService.articalControls.subscribe((value) => {
  //     console.log("going to subscribe next", value)
  //     this.articalControls$ = value;
  //   });
  //   return this.articalControls$;
  // }
}
