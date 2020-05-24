import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LogInComponent } from './log-in/log-in.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';



@NgModule({
  declarations: [
    ChangePasswordComponent,
    LogInComponent,
    MessageModalComponent,
    RecoverPasswordComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AuthorizationModule { }
