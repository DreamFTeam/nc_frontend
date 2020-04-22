import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {RecoverPasswordComponent} from './recover-password/recover-password.component';
import {LogInComponent} from './log-in/log-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthenticationService} from './_services/authentication.service';
import {HttpClientModule} from '@angular/common/http';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ChangePasswordComponent} from './change-password/change-password.component';

const appRoutes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'recovery', component: ChangePasswordComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  declarations: [
    AppComponent,
    RecoverPasswordComponent,
    LogInComponent,
    SignUpComponent,
    LandingPageComponent,
    NavBarComponent,
    ChangePasswordComponent
  ],
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
  entryComponents: [LogInComponent, SignUpComponent, RecoverPasswordComponent],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
