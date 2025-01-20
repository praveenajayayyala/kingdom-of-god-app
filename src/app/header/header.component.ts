import { Component, Input } from '@angular/core';
import { ArticalControlBase } from '../artical-controls/artical-control-base';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone:false
})
export class HeaderComponent {
 @Input() header: ArticalControlBase<string> | undefined;
}
