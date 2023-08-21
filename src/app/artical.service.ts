import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ArticalControlBase } from './artical-controls/artical-control-base';
import { DropdownControl } from './artical-controls/control-dropdown';
import { TextboxControl } from './artical-controls/control-textbox';
import { DivControl } from './artical-controls/control-div';
import { ImageControl } from './artical-controls/control-img';

@Injectable()
export class ArticalService {
  controls: ArticalControlBase<string>[] = [];
  controlsByParentKey = new Map<string, ArticalControlBase<string>[]>();
  // TODO: get from a remote source of question metadata
  getQuestions() {
    this.controls = [
      new DivControl({
        key: 'first-Row',
        row: 1,
        layout: {
          fxLayout: 'row',
          fxLayoutAlignVertical: 'center',
          fxLayoutAlignHorizontal: 'stretch',
          fxflex: '100%',
          fxLayoutGap: '',
          default: false,
          color: 'red',
        },
        order: 1,
        hasChildren: true,
      }),
      new DivControl({
        key: 'second-Row',
        parentKey: 'first-Row',
        row: 2,
        layout: {
          fxLayout: 'column',
          fxLayoutAlignVertical: 'center',
          fxLayoutAlignHorizontal: 'stretch',
          fxflex: '100%',
          fxLayoutGap: '',
          default: false,
          color: 'blue',
        },
        hasChildren: true,
        order: 2,
      }),
      new ImageControl({
        key: 'phonecontact',
        parentKey: 'second-Row',
        label: 'Phone',
        type: 'image',
        order: 3,
        src: 'https://www.calvary-ag.net/C.jpg',
      }),
      new DivControl({
        key: 'third-Row',
        parentKey: 'first-Row',
        row: 3,
        layout: {
          fxLayout: 'column',
          fxLayoutAlignVertical: 'center',
          fxLayoutAlignHorizontal: 'stretch',
          fxflex: '100%',
          fxLayoutGap: '',
          default: false,
          color: 'blue',
        },
        hasChildren: true,
        order: 2,
      }),

      new DropdownControl({
        key: 'brave',
        parentKey: 'third-Row',
        label: 'Bravery Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' },
        ],
        value: 'good',
        order: 5,
      }),
      new TextboxControl({
        key: 'firstName',
        parentKey: 'third-Row',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 4,
      }),
      /*new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' },
        ],
        order: 3,
      }),

      new DropdownQuestion({
        key: 'gender',
        label: 'Gender',
        options: [
          { key: 'male', value: 'Male' },
          { key: 'female', value: 'Female' },
        ],
        order: 4,
      }),
      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1,
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2,
      }),
      new TextboxQuestion({
        key: 'phonecontact',
        label: 'Phone',
        type: 'text',
        order: 5,
      }),
      new ImageQuestion({
        key: 'phonecontact',
        label: 'Phone',
        type: 'image',
        order: 5,
        src: 'https://www.calvary-ag.net/C.jpg',
      }),*/
    ];
    this.controlsByParentKey = new Map<string, ArticalControlBase<string>[]>();
    for (var i = 0; i < this.controls.length; i++) {
      var key = this.controls[i].parentKey;
      var value = this.controls[i];

      if (this.controlsByParentKey.get(key) != null) {
        this.controlsByParentKey.get(key)?.push(value);
      } else {
        this.controlsByParentKey.set(key, [value]);
      }
    }
    this.controls.forEach((crtl) => {
      if (this.controlsByParentKey.get(crtl.key)) {
        crtl.children = this.controlsByParentKey.get(crtl.key);
      }
    });
    console.log(
      'this.controls=> ',
      this.controls.filter((v) => v.parentKey == '')
    );
    return of(
      this.controls
        ?.filter((v) => v.parentKey == '')
        .sort((a, b) => a.order - b.order)
    );
  }
  getChildrenControls(parentKey: string) {
    return this.controlsByParentKey.get(parentKey);
  }
}
