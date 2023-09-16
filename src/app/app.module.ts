import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { MaterialModule } from "./material-module";
import { AppComponent } from "./app.component";
import { DynamicFormComponent } from "./dynamic-form-question/dynamic-form.component";
import { DynamicFormQuestionComponent } from "./dynamic-form-question/dynamic-form-question.component";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AdminComponent } from "./admin/admin.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ArticalComponent } from "./artical/artical.component";
import { DynamicArticalComponent } from "./artical-dynamic-form/dynamic-artical.component";
import { DynamicArticalControlComponent } from "./artical-dynamic-form/dynamic-artical-control.component";
import { DynamicArticalParentDivComponent } from "./artical-dynamic-form/dynamic-artical-parent-div.component";
import { HttpClientModule } from "@angular/common/http";
import { LogoutComponent } from "./logout/logout.component";
import { NavigationTreeComponent } from "./navigation-tree/navigation-tree.component";
import { NodeItemPipe } from "./modal/nodePipe";
import { AngularDraggableModule } from "angular2-draggable";

const appRoutes: Routes = [
  { path: "admin", component: AdminComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "artical", component: ArticalComponent },
  { path: "logout", component: LogoutComponent },
];
@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    AngularDraggableModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  declarations: [
    AppComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    DynamicArticalComponent,
    DynamicArticalControlComponent,
    DynamicArticalParentDivComponent,
    HomeComponent,
    AdminComponent,
    ArticalComponent,
    LogoutComponent,
    NavigationTreeComponent,
    NodeItemPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
