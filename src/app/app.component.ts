import { Component } from '@angular/core';

import { QuestionService } from './question.service';
import { QuestionBase } from './controls/question-base';
import { Observable } from 'rxjs';
import { ArticalService } from './artical.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [QuestionService, ArticalService],
})
export class AppComponent {
  // questions$: Observable<QuestionBase<any>[]>;
  // constructor(service: QuestionService) {
  //   this.questions$ = service.getQuestions();
  // }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
