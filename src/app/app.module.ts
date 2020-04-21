import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthenticationService} from './_services/authentication.service';
import { HttpClientModule} from '@angular/common/http';
import { QuizComponent } from './quiz/quiz.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TrueFalseComponent } from './true-false/true-false.component';
import { SeqOptionsComponent } from './seq-options/seq-options.component';
import { OneOfFourComponent } from './one-of-four/one-of-four.component';
import { OpenAnswerComponent } from './open-answer/open-answer.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';

const appRoutes: Routes =[
    { path: '', component: LandingPageComponent },
    { path: 'log-in', component: LogInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'forgot-pass', component: RecoverPasswordComponent },
    { path: 'quiz', component: QuizComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    RecoverPasswordComponent,
    LogInComponent,
    SignUpComponent,
    LandingPageComponent,
    QuizComponent,
    NavbarComponent,
    TrueFalseComponent,
    SeqOptionsComponent,
    OneOfFourComponent,
    OpenAnswerComponent,
    EditQuestionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
