import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AdminPanelModule } from './modules/admin-panel/admin-panel.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { LogInComponent } from './modules/authorization/log-in/log-in.component';
import { RecoverPasswordComponent } from './modules/authorization/recover-password/recover-password.component';
import { SignUpComponent } from './modules/authorization/sign-up/sign-up.component';
import { CoreModule } from './modules/core/core.module';
import { ErrorInterceptor } from './modules/core/_helpers/error.interceptor';
import { JwtInterceptor } from './modules/core/_helpers/jwt.interceptor';
import { MissingTranslationService } from './modules/core/_helpers/missing';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { GameModule } from './modules/game/game.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { QuizCreateModule } from './modules/quiz-create/quiz-create.module';
import { QuizViewModule } from './modules/quiz-view/quiz-view.module';
import { SharedModule } from './modules/shared/shared.module';
import { ValidationModule } from './modules/validation/validation.module';

const appRoutes: Routes = [];

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationService },
      useDefaultLang: false,
    }),


    CoreModule,
    SharedModule,
    ProfilesModule,
    QuizCreateModule,
    ValidationModule,
    DashboardModule,
    GameModule,
    AdminPanelModule,
    QuizViewModule,
    AuthorizationModule,
    ActivitiesModule,
    NotificationsModule
  ],
  entryComponents: [LogInComponent, SignUpComponent, RecoverPasswordComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
