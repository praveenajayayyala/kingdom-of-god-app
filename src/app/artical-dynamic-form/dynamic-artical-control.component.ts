import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ArticalControlBase } from "../artical-controls/artical-control-base";

@Component({
    selector: "app-artical-control",
    templateUrl: "./dynamic-artical-control.component.html",
    standalone: false
})
export class DynamicArticalControlComponent {
  @Input() control!: ArticalControlBase<string>;
  @Input() form!: FormGroup;

  get isValid() {
    // console.log("this.control?.required", this.control?.required, this.control)
    return this.control?.required as boolean ? this.form?.controls[this.control.key]?.valid ?? true : true;
  }
}
