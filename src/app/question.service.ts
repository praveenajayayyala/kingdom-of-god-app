import { Injectable } from '@angular/core';

import { DropdownQuestion } from './controls/question-dropdown';
import { QuestionBase } from './controls/question-base';
import { TextboxQuestion } from './controls/question-textbox';
import { of } from 'rxjs';
import { ImageQuestion } from './controls/question-img';

@Injectable()
export class QuestionService {
  // TODO: get from a remote source of question metadata
  getQuestions() {
    const questions: QuestionBase<string>[] = [
      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' },
        ],
        order: 3,
      }),

      new DropdownQuestion({
        key: 'gender',
        label: 'Gender',
        options: [
          { key: 'male', value: 'Male' },
          { key: 'female', value: 'Female' },
        ],
        order: 4,
      }),
      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1,
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2,
      }),
      new TextboxQuestion({
        key: 'phonecontact',
        label: 'Phone',
        type: 'text',
        order: 5,
      }),
      new ImageQuestion({
        key: 'header',
        label: 'Phone',
        type: 'image',
        order: 6,
        src: 'https://ultimaworks.ltimindtree.com/assets/icons/Ultima_works_blue.svg',
      }),
    ];

    return of(questions.sort((a, b) => a.order - b.order));
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
