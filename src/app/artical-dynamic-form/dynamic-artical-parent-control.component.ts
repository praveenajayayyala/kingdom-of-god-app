import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ArticalControlBase } from '../artical-controls/artical-control-base';
import { ArticalService } from '../artical.service';
import { ArticalControlService } from '../artical-control.service';

@Component({
  selector: 'app-artical-parent-control',
  templateUrl: './dynamic-artical-parent-control.component.html',
})
export class DynamicArticalParentControlComponent {
  //articalControls$: Observable<ArticalControlBase<any>[]>;
  constructor(
    private service: ArticalService,
    private ctrlService: ArticalControlService
  ) {
    //this.articalControls$ = service.getQuestions();
  }
  @Input() parentControl!: ArticalControlBase<string>;
  @Input() form!: FormGroup;

  // get isValid() {
  //   return this.form.controls[this.parentControl.key].valid;
  // }
}
