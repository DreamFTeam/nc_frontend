import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { QuizComponent } from './quiz/quiz.component';
import { ViewQuizComponent } from './view-quiz/view-quiz.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UsersComponent } from './users/users.component';
import { PrivilegedProfileComponent } from './privileged-profile/privileged-profile.component';
import { ValidationPageComponent } from './validation-page/validation-page.component';
import { QuizValidationComponent } from './quiz-validation/quiz-validation.component';
import { AnnouncementEditComponent } from './announcement-edit/announcement-edit.component';
import { AuthGuard } from './guards/editor.guard';
import { Role } from './_models/role';
import {GameSettingsComponent} from './game-settings/game-settings.component';
import {GameConnectorComponent} from './game-connector/game-connector.component';
import {GameConnectionGuard} from './guards/game-connection.guard';
import {AnonymInitComponent} from './anonym-init/anonym-init.component';
import {GameCreatorGuard} from './guards/game-creator.guard';


const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'recovery', component: ChangePasswordComponent},
  { path: 'quizedit/:id', component: QuizComponent},
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'editprofile', component: EditProfileComponent},
  { path: 'users', component: UsersComponent },
  { path: 'privileged/main', component: PrivilegedProfileComponent },
  { path: 'quizcreate', component: QuizComponent, canActivate: [AuthGuard], data: { roles: [Role.User] }},
  { path: 'viewquiz/:id', component: ViewQuizComponent, canActivate: [AuthGuard], data: { roles: [Role.User] }},
  { path: 'quiz-list', component: QuizListComponent},
  { path: 'validation', component: ValidationPageComponent},
  { path: 'validation/:id', component: QuizValidationComponent},
  { path: 'editannouncements', component: AnnouncementEditComponent},
  { path: 'quiz/:id/newgame', canActivate: [GameCreatorGuard], component: GameSettingsComponent },
  { path: 'game/:id/lobby', component: GameConnectorComponent },
  { path: 'join/:accessId', canActivate: [GameConnectionGuard], component: AnonymInitComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
