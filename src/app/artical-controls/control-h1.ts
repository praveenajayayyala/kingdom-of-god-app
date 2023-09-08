import { ArticalControlBase } from './artical-control-base';

export class H1Control extends ArticalControlBase<string> {
  override controlType = 'h1';
  static dummy = ArticalControlBase.derived.add("h1");
}
