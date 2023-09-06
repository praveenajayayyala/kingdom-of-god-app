import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ArticalControlBase } from "./artical-controls/artical-control-base";

@Injectable()
export class ArticalControlService {
  group: any = {};
  toFormGroup(articalControls: ArticalControlBase<string>[]) {
    articalControls.forEach((crtl) => this.recurse(crtl));
    return new FormGroup(this.group);
  }

  recurse(control: ArticalControlBase<string>) {
    this.group[control.key] = control.required
      ? new FormControl(control.value || "", Validators.required)
      : new FormControl(control.value || "");

    if (control.children != null) {
      control.children.forEach((childCrtl) => {
        this.group[childCrtl.key] = childCrtl.required
          ? new FormControl(childCrtl.value || "", Validators.required)
          : new FormControl(childCrtl.value || "");
        this.recurse(childCrtl);
      });
    }
  }
}
