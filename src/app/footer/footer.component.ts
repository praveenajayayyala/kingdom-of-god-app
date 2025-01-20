import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  standalone: false
})
export class FooterComponent {
  currentYear: Date = new Date();
  @Input() footerStyle: string |undefined;
}
