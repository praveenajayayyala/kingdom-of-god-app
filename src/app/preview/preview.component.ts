import { Component, Injectable, OnInit } from "@angular/core";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { ArticleService } from "../artical.service";
import { BehaviorSubject, take } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class PreviewDataSharingService {
  articalControls: BehaviorSubject<
    ArticalControlBase<string>[]
  > = new BehaviorSubject<ArticalControlBase<string>[]>([]);
  //bookingListener$ = this.articalControls.asObservable();
}
@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"],
  providers: [PreviewDataSharingService],
})
export class PreviewComponent implements OnInit {
  articalControls$: ArticalControlBase<string>[] = [];
  statusMessage = { message: "", color: "" };
  //private onDestroy = new Subject<void>();
  //acceptedControls$: Observable<ArticalControlBase<string>[]> = this.previewService.bookingListener$;
  constructor(
    private route: ActivatedRoute,
    private previewService: ArticleService,
    private previewDataService: PreviewDataSharingService
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   let queryStringPostId = params["postId"];
    //   if (queryStringPostId == undefined || queryStringPostId == "") {
    //     this.statusMessage = { message: "PostId missing!", color: "red" };
    //     return;
    //   }
    //   this.previewService
    //     .getArticlesByPostId(queryStringPostId)
    //     .then((ctrls) => {
    //       this.previewDataService.articalControls.next(ctrls);
    //     });
    // });
    let articleControls: ArticalControlBase<string>[] = JSON.parse(localStorage.getItem('pageControls')+'')
    this.previewDataService.articalControls.next(articleControls);
  }

  ngOnInit(): void {
    console.log("PreviewComponent-Crtls", this.previewService.previewContent);
    this.previewDataService.articalControls.subscribe((value) => {
      this.articalControls$ = value;
    });
  }
}
