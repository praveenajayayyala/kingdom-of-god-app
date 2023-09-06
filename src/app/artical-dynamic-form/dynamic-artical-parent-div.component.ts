import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ArticalControlBase } from "../artical-controls/artical-control-base";

@Component({
  selector: "app-artical-parent-control",
  templateUrl: "./dynamic-artical-parent-div.component.html",
})
export class DynamicArticalParentDivComponent {
  @Input() parentControl!: ArticalControlBase<string>;
  @Input() form!: FormGroup;
  get styleOfControl() {
    return "background-color: " + this.parentControl.backGroundColor;
  }
}
