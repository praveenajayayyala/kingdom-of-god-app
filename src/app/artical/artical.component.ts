import { Component } from '@angular/core';
import { ArticalService } from '../artical.service';
import { Observable } from 'rxjs/internal/Observable';
import { ArticalControlBase } from '../artical-controls/artical-control-base';

@Component({
  selector: 'app-artical',
  templateUrl: './artical.component.html',
  styleUrls: ['./artical.component.css'],
})
export class ArticalComponent {
  articalControls$: Observable<ArticalControlBase<any>[]>;
  constructor(service: ArticalService) {
    this.articalControls$ = service.getQuestions();
    console.log('this.articalControls$>>', this.articalControls$);
  }
}
