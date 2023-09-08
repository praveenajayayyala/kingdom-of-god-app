import { ArticalControlBase } from './artical-control-base';

export class TextboxControl extends ArticalControlBase<string> {
  override controlType = 'textbox';
  static dummy = ArticalControlBase.derived.add("textbox");
}
