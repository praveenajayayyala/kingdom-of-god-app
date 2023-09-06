import { Component } from "@angular/core";
import { ArticalService } from "../artical.service";
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
export class ArticalComponent {
  articalControls$: ArticalControlBase<string>[] = [];
  constructor(
    private service: ArticalService,
    private dataSharingService: DataSharingService
  ) {
    this.service.getArticlesByPostId("1003").then((ctrls) => {
      this.dataSharingService.articalControls.next(ctrls);
    });
  }
  get articalControls() {
    this.dataSharingService.articalControls.subscribe((value) => {
      this.articalControls$ = value;
    });
    return this.articalControls$;
  }
}
