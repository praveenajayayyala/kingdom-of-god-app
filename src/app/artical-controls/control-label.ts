import { ArticalControlBase } from './artical-control-base';

export class LabelControl extends ArticalControlBase<string> {
  override controlType = 'label';
  static dummy = ArticalControlBase.derived.add("label");
}
