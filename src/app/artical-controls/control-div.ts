import { ArticalControlBase } from './artical-control-base';

export class DivControl extends ArticalControlBase<string> {
  override controlType = 'div';
  static dummy = ArticalControlBase.derived.add("div");
}
