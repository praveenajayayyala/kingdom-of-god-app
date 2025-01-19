import { ArticalControlBase } from './artical-control-base';

export class HeaderControl extends ArticalControlBase<string> {
  override controlType = 'header';
  static dummy = ArticalControlBase.derived.add("header");
}
