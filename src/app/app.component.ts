import { Component } from '@angular/core';

import { QuestionService } from './question.service';
import { QuestionBase } from './controls/question-base';
import { Observable } from 'rxjs';
import { ArticalService } from './artical.service';
import { AuthorizeService } from './authorize.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [QuestionService, ArticalService, AuthorizeService],
})
export class AppComponent {
  menucss: string = ' ';
  openCloseMenu() {
    if (this.menucss == 'collapse navbar-collapse') {
      this.menucss = 'collapse navbar-collapse in';
    } else {
      this.menucss = 'collapse navbar-collapse';
    }
  }
}
