import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from './_services/authentication.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { QuizComponent } from './quiz/quiz.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TrueFalseComponent } from './true-false/true-false.component';
import { SeqOptionsComponent } from './seq-options/seq-options.component';
import { OneOfFourComponent } from './one-of-four/one-of-four.component';
import { OpenAnswerComponent } from './open-answer/open-answer.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { ViewQuizComponent } from './view-quiz/view-quiz.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizListService } from './_services/quiz-list.service';
import { QuizService } from './_services/quiz.service';
import { QuestionService } from './_services/question.service';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PrivilegedProfileComponent } from './privileged-profile/privileged-profile.component';
import { CreatePrivilegedComponent } from './create-privileged/create-privileged.component';
import { ValidationPageComponent } from './validation-page/validation-page.component';
import { ValidationTabComponent } from './validation-page/validation-tab/validation-tab.component';
import { QuizValidationListService } from './_services/quiz-validation-list.service';
import { QuizValidationComponent } from './quiz-validation/quiz-validation.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { AnnouncementViewComponent } from './announcement-view/announcement-view.component';
import { AnnouncementEditComponent } from './announcement-edit/announcement-edit.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShortQuizListComponent } from './short-quiz-list/short-quiz-list.component';
import { QuestionEditorSelectorComponent } from './question-editor-selector/question-editor-selector.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { GameConnectorComponent } from './game-connector/game-connector.component';
import { QRCodeModule } from 'angularx-qrcode';
import { AnonymInitComponent } from './anonym-init/anonym-init.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { AnonymService } from './_services/anonym.service';
import { NotificationsComponent } from './notifications/notifications.component';
import {QuizFilterComponent} from './quiz-filter/quiz-filter.component';

const appRoutes: Routes = [];


@NgModule({
  declarations: [
    AppComponent,
    RecoverPasswordComponent,
    LogInComponent,
    SignUpComponent,
    LandingPageComponent,
    QuizListComponent,
    QuizComponent,
    TrueFalseComponent,
    SeqOptionsComponent,
    OneOfFourComponent,
    OpenAnswerComponent,
    EditQuestionComponent,
    ViewQuizComponent,
    NavBarComponent,
    ChangePasswordComponent,
    NavBarComponent,
    ProfileComponent,
    UsersComponent,
    EditProfileComponent,
    PrivilegedProfileComponent,
    CreatePrivilegedComponent,
    ValidationPageComponent,
    ValidationTabComponent,
    QuizValidationComponent,
    ConfirmModalComponent,
    AnnouncementViewComponent,
    AnnouncementEditComponent,
    ShortQuizListComponent,
    QuestionEditorSelectorComponent,
    GameSettingsComponent,
    GameConnectorComponent,
    AnonymInitComponent,
    MessageModalComponent,
    QuizFilterComponent,
    NotificationsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    QRCodeModule
  ],
  entryComponents: [LogInComponent, SignUpComponent, RecoverPasswordComponent],
  providers: [AuthenticationService, QuizListService, QuestionService, QuizService, QuizValidationListService, AnonymService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
