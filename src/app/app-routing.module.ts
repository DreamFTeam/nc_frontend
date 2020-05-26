import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './modules/dashboard/landing-page/landing-page.component';
import { ChangePasswordComponent } from './modules/authorization/change-password/change-password.component';
import { QuizComponent } from './modules/quiz-create/quiz/quiz.component';
import { ViewQuizComponent } from './modules/quiz-view/view-quiz/view-quiz.component';
import { QuizListComponent } from './modules/quiz-view/quiz-list/quiz-list.component';
import { ProfileComponent } from './modules/profiles/profile/profile.component';
import { EditProfileComponent } from './modules/profiles/edit-profile/edit-profile.component';
import { UsersComponent } from './modules/profiles/users/users.component';
import { PrivilegedProfileComponent } from './modules/admin-panel/privileged-profile/privileged-profile.component';
import { ValidationPageComponent } from './modules/validation/validation-page/validation-page.component';
import { QuizValidationComponent } from './modules/validation/quiz-validation/quiz-validation.component';
import { AnnouncementEditComponent } from './modules/admin-panel/announcement-edit/announcement-edit.component';
import { Role } from './modules/core/_models/role';
import { GameSettingsComponent } from './modules/game/game-settings/game-settings.component';
import { GameConnectorComponent } from './modules/game/game-connector/game-connector.component';
import { NotificationsComponent } from './modules/notifications/notifications/notifications.component';
import { QuizFilterComponent } from './modules/quiz-view/quiz-filter/quiz-filter.component';
import { ActivitiesComponent } from './modules/activities/activities/activities.component';
import { UserInvitationsComponent } from './modules/profiles/user-invitations/user-invitations.component';
import { GameQuestionComponent } from './modules/game/game-question/game-question.component';
import { GameResultComponent } from './modules/game/game-result/game-result.component';
import { AuthGuard } from './modules/core/_helpers/auth.guard';
import { GameConnectionGuard } from './modules/core/_helpers/game-connection.guard';
import { GameCreatorGuard } from './modules/core/_helpers/game-creator.guard';
import { UserSettingsComponent } from './modules/profiles/user-settings/user-settings.component';


const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'recovery/:id', component: ChangePasswordComponent },
    {
        path: 'quizedit/:id', component: QuizComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User] }
    },
    {
        path: 'profile/:username', component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User, Role.Admin, Role.SuperAdmin, Role.Moderator] }
    },
    {
        path: 'profile/:username/:page', component: ProfileComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.User, Role.Admin, Role.SuperAdmin, Role.Moderator]}
    },
    {
        path: 'profile', component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User, Role.Admin, Role.SuperAdmin, Role.Moderator] }
    },
    {
        path: 'editprofile', component: EditProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User, Role.Admin, Role.SuperAdmin, Role.Moderator] }
    },
    {
        path: 'users', component: UsersComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User, Role.Admin, Role.SuperAdmin, Role.Moderator] }
    },
    {
        path: 'privileged/main', component: PrivilegedProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.SuperAdmin, Role.Moderator] }
    },
    {
        path: 'quizcreate', component: QuizComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User] }
    },
    { path: 'viewquiz/:id', component: ViewQuizComponent },
    { path: 'quiz-list', component: QuizListComponent },
    {
        path: 'validation',
        component: ValidationPageComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Moderator, Role.SuperAdmin] }
    },
    {
        path: 'validation/:id',
        component: QuizValidationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Moderator, Role.SuperAdmin] }
    },
    {
        path: 'editannouncements', component: AnnouncementEditComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Moderator, Role.SuperAdmin] }
    },
    {
        path: 'requests', component: UserInvitationsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User] }
    },
    {
        path: 'settings', component: UserSettingsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User, Role.Admin, Role.SuperAdmin, Role.Moderator] }
    },
    {
        path: 'activities', component: ActivitiesComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.User] }
    },
    { path: 'quiz/:id/newgame', canActivate: [GameCreatorGuard], component: GameSettingsComponent },
    { path: 'game/:id/lobby', component: GameConnectorComponent },
    { path: 'join/:accessId', canActivate: [GameConnectionGuard], component: QuizListComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'filterquiz', component: QuizFilterComponent },
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
