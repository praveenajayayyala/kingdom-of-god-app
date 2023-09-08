import { ArticalControlBase } from './artical-control-base';

export class ImageControl extends ArticalControlBase<string> {
  override controlType = 'image';
  static dummy = ArticalControlBase.derived.add("image");
}
