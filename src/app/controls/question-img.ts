import { QuestionBase } from './question-base';

export class ImageQuestion extends QuestionBase<string> {
  override controlType = 'image';
}
