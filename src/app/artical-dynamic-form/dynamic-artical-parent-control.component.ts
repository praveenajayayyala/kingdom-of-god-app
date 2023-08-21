import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ArticalControlBase } from '../artical-controls/artical-control-base';
import { Observable } from 'rxjs/internal/Observable';
import { ArticalService } from '../artical.service';
import { concatMap } from 'rxjs/internal/operators/concatMap';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { tap } from 'rxjs/internal/operators/tap';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { zip } from 'rxjs/internal/observable/zip';
import { toArray } from 'rxjs/internal/operators/toArray';
import { map } from 'rxjs/internal/operators/map';
import { of } from 'rxjs/internal/observable/of';
import { ArticalControlService } from '../artical-control.service';
import { DropdownControl } from '../artical-controls/control-dropdown';

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
