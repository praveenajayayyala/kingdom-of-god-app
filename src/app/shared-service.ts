import { Injectable } from '@angular/core';
   import { BehaviorSubject } from 'rxjs';

   @Injectable({
     providedIn: 'root',
   })
   export class SharedService {
     private backgroundColor = new BehaviorSubject<string>('white');
     backgroundColor$ = this.backgroundColor.asObservable();

     updateBackgroundColor(color: string) {
       this.backgroundColor.next(color);
     }
   }