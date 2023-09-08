import { ArticalControlBase } from './artical-control-base';

export class DropdownControl extends ArticalControlBase<string> {
  override controlType = 'dropdown';
  static dummy = ArticalControlBase.derived.add("dropdown");
}
