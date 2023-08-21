import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ArticalControlBase } from '../artical-controls/artical-control-base';
import { ArticalControlService } from '../artical-control.service';

@Component({
  selector: 'app-artical-form',
  templateUrl: './dynamic-artical.component.html',
  providers: [ArticalControlService],
})
export class DynamicArticalComponent implements OnInit {
  @Input() articalControls: ArticalControlBase<string>[] | null = [];
  form!: FormGroup;
  payLoad = '';

  constructor(private qcs: ArticalControlService) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(
      this.articalControls as ArticalControlBase<string>[]
    );
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}
