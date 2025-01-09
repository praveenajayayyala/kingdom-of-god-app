import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { ArticalControlService } from "../artical-control.service";
import { ArticleService } from "../artical.service";

@Component({
    selector: "app-artical-form",
    templateUrl: "./dynamic-artical.component.html",
    providers: [ArticalControlService],
    standalone: false
})
export class DynamicArticalComponent implements OnInit {
  @Input() articalControls: any;
  form: FormGroup = new FormGroup({
    firstName: new FormControl(),
  });
  payLoad = "";

  constructor(
    private qcs: ArticalControlService,
    private service: ArticleService
  ) {}

  ngOnInit() {
    //console.log("articalControls", this.articalControls);
    this.form = this.qcs.toFormGroup(
      this.articalControls as ArticalControlBase<string>[]
    );
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}
