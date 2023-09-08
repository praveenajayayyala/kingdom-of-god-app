import { ArticalControlBase } from './artical-control-base';

export class PeraControl extends ArticalControlBase<string> {
  override controlType = 'pera';
  static dummy = ArticalControlBase.derived.add("pera");
}
