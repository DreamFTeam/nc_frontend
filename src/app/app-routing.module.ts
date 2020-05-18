import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { GameConnectorComponent } from './game-connector/game-connector.component';
import { GameConnectionGuard } from './guards/game-connection.guard';
import { AnonymInitComponent } from './anonym-init/anonym-init.component';
import { GameCreatorGuard } from './guards/game-creator.guard';
import { NotificationsComponent } from './notifications/notifications.component';
import { QuizFilterComponent } from './quiz-filter/quiz-filter.component';
import { ActivitiesComponent } from './activities/activities.component';
import { UserInvitationsComponent } from './user-invitations/user-invitations.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { GameQuestionComponent } from './game-question/game-question.component';
import { AuthGuard } from './guards/editor.guard';
import { Role } from './_models/role';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { GameConnectorComponent } from './game-connector/game-connector.component';
import { GameConnectionGuard } from './guards/game-connection.guard';
import { AnonymInitComponent } from './anonym-init/anonym-init.component';
import { GameCreatorGuard } from './guards/game-creator.guard';
import { GameResultComponent } from './game-result/game-result.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'recovery', component: ChangePasswordComponent },
  { path: 'quizedit/:id', component: QuizComponent, canActivate: [AuthGuard], data: { roles: [Role.User] } },
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'editprofile', component: EditProfileComponent },
  { path: 'users', component: UsersComponent },
  { path: 'privileged/main', component: PrivilegedProfileComponent },
  { path: 'quizcreate', component: QuizComponent, canActivate: [AuthGuard], data: { roles: [Role.User] } },
  { path: 'viewquiz/:id', component: ViewQuizComponent },
  { path: 'quiz-list', component: QuizListComponent },
  { path: 'validation', component: ValidationPageComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Moderator, Role.SuperAdmin] } },
  { path: 'validation/:id', component: QuizValidationComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Moderator, Role.SuperAdmin] } },

  {
    path: 'editannouncements', component: AnnouncementEditComponent,
    canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Moderator, Role.SuperAdmin] }
  },
  { path: 'requests', component: UserInvitationsComponent },
  { path: 'quiz/:id/newgame', canActivate: [GameCreatorGuard], component: GameSettingsComponent },
  { path: 'game/:id/lobby', component: GameConnectorComponent },
  { path: 'join/:accessId', canActivate: [GameConnectionGuard], component: AnonymInitComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'filterquiz', component: QuizFilterComponent },
  { path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard], data: { roles: [Role.User] } },
  { path: 'play/:gameid', component: GameQuestionComponent },
  { path: 'game/result/:id', component: GameResultComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
