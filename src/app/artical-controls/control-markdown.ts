import { ArticalControlBase } from './artical-control-base';

export class MarkdownControl extends ArticalControlBase<string> {
  override controlType = 'markdown';
  static dummy = ArticalControlBase.derived.add("markdown");
}
