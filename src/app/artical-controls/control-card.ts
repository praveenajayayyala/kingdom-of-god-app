import { ArticalControlBase } from './artical-control-base';

export class CardBasicControl extends ArticalControlBase<string> {
  override controlType = 'card-basic';
  static dummy = ArticalControlBase.derived.add("card-basic");
}
