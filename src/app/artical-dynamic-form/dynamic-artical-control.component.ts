import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ArticalControlBase } from '../artical-controls/artical-control-base';

@Component({
  selector: 'app-artical-control',
  templateUrl: './dynamic-artical-control.component.html',
})
export class DynamicArticalControlComponent {
  @Input() control!: ArticalControlBase<string>;
  @Input() form!: FormGroup;

  get isValid() {
    console.log(
      'DynamicArticalControlComponent-control',
      this.control.key,
      this.form.controls
    );
    //if (this.control.controlType == 'div') return true;
    return this.form.controls[this.control.key].valid;
  }
}