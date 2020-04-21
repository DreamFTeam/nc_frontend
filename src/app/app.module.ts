import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from './_services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrentProfileComponent } from './current-profile/current-profile.component';
import { UsersComponent } from './users/users.component';

const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'log-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-pass', component: RecoverPasswordComponent },
  { path: 'profile', component: CurrentProfileComponent },
  { path: 'users', component: UsersComponent },

];
@NgModule({
  declarations: [
    AppComponent,
    RecoverPasswordComponent,
    LogInComponent,
    SignUpComponent,
    LandingPageComponent,
    NavBarComponent,
    CurrentProfileComponent,
    UsersComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule
  ],
  entryComponents: [LogInComponent, SignUpComponent],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
