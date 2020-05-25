import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {ProfileComponent} from './profile/profile.component';
import {UserChangePasswordComponent} from './user-change-password/user-change-password.component';
import {UserInvitationsComponent} from './user-invitations/user-invitations.component';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import {UsersComponent} from './users/users.component';


@NgModule({
    declarations: [EditProfileComponent,
        ProfileComponent,
        UserChangePasswordComponent,
        UserInvitationsComponent,
        UserSettingsComponent,
        UsersComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class ProfilesModule {
}
