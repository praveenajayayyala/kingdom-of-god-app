import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
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
