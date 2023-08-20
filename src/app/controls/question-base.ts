export class QuestionBase<T> {
  value: T | undefined;
  key: string;
  label: string;
  required: boolean;
  src: string;
  order: number;
  controlType: string;
  type: string;
  options: { key: string; value: string }[];

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      src?: string;
      controlType?: string;
      type?: string;
      options?: { key: string; value: string }[];
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.src = options.src || '';
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/