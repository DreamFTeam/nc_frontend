import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { QuizComponent } from './quiz/quiz.component';
import { ViewQuizComponent } from './view-quiz/view-quiz.component';


const routes: Routes = [{path: '', component: LandingPageComponent},
{path: 'recovery', component: ChangePasswordComponent},
{ path: 'quizedit/:id', component: QuizComponent},
{ path: 'quizcreate', component: QuizComponent},
{ path: 'viewquiz/:id', component: ViewQuizComponent},
{path: '**', redirectTo: ''}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
