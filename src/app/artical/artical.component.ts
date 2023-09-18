import { Component, OnInit } from "@angular/core";
import { ArticleService } from "../artical.service";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

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
    private dataSharingService: DataSharingService
  ) {
    this.service.getArticlesByPostId("1003").then((ctrls) => {
      console.log("going to call next")
      this.dataSharingService.articalControls.next(ctrls);
    });
  }
  ngOnInit(): void {
    this.dataSharingService.articalControls.subscribe((value) => {
      console.log("going to subscribe next", value)
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
