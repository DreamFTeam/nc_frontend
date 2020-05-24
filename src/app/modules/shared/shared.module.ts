import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ToastsComponent } from './toasts/toasts.component';
import { YesNoModalComponent } from './yes-no-modal/yes-no-modal.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    NavBarComponent,
    ToastsComponent,
    YesNoModalComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule
  ],
  exports: [
    NavBarComponent,
    ToastsComponent,
    YesNoModalComponent,
    NgbModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
