import { ArticalControlBase } from './artical-control-base';

export class H3Control extends ArticalControlBase<string> {
  override controlType = 'h3';
  static dummy = ArticalControlBase.derived.add("h3");
}
