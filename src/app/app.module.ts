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
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { LogoutComponent } from "./logout/logout.component";
import { NavigationTreeComponent } from "./navigation-tree/navigation-tree.component";
import { NodeItemPipe } from "./modal/nodePipe";
import { AngularDraggableModule } from "angular2-draggable";
import { PreviewComponent } from './preview/preview.component';
import { ArticleService } from "./artical.service";
import { AuthorizeService } from "./authorize.service";
import { QuestionService } from "./question.service";
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

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
  { path: "contact-us", component: ContactUsComponent },
  { path: "about-us", component: AboutUsComponent },
  { path: "articles", component: ArticalComponent },
  { path: "preview", component: PreviewComponent },
  { path: "logout", component: LogoutComponent },
];
@NgModule({ declarations: [
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
        PreviewComponent,
        AboutUsComponent,
        ContactUsComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        AngularDraggableModule,
        RouterModule.forRoot(appRoutes, { enableTracing: true } // <-- debugging purposes only
        )], providers: [QuestionService, ArticleService, AuthorizeService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
