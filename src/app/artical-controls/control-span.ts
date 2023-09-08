import { ArticalControlBase } from './artical-control-base';

export class SpanControl extends ArticalControlBase<string> {
  override controlType = 'span';
  static dummy = ArticalControlBase.derived.add("span");
}
