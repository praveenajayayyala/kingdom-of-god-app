import { ArticalControlBase } from './artical-control-base';

export class CardOfArticalControl extends ArticalControlBase<string> {
  override controlType = 'card-artical';
  static dummy = ArticalControlBase.derived.add("card-artical");
}
