import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { ArticalControlService } from "../artical-control.service";
import { ArticalService } from "../artical.service";

@Component({
  selector: "app-artical-form",
  templateUrl: "./dynamic-artical.component.html",
  providers: [ArticalControlService],
})
export class DynamicArticalComponent implements OnInit {
  @Input() articalControls: any;
  form: FormGroup = new FormGroup({
    firstName: new FormControl(),
  });
  payLoad = "";

  constructor(
    private qcs: ArticalControlService,
    private service: ArticalService
  ) {}

  ngOnInit() {
    if (this.articalControls.length <= 0) {
      this.service.getArticlesByPostId("1003").then((ctrls) => {
        this.articalControls = ctrls;
        this.form = this.qcs.toFormGroup(
          this.articalControls as ArticalControlBase<string>[]
        );
      });
    } else {
      this.form = this.qcs.toFormGroup(
        this.articalControls as ArticalControlBase<string>[]
      );
    }
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}
