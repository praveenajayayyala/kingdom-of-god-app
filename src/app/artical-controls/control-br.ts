import { ArticalControlBase } from './artical-control-base';

export class BRControl extends ArticalControlBase<string> {
  override controlType = 'br';
  static dummy = ArticalControlBase.derived.add("br");
}
