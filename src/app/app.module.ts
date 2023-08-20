import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material-module';
import { AppComponent } from './app.component';
import { DynamicFormComponent } from './dynamic-form-question/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
];
@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  declarations: [
    AppComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    HomeComponent,
    AdminComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
