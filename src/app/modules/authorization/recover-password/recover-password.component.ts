import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  isSent: boolean;
  email: string;
  loading: boolean;
  message: string;

  constructor(
    private authenticationService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.isSent = false;
    this.loading = false;
  }

  requestPasswordChange() {
    if (this.email == '' || this.email == null) {
      this.message = this.translateService.instant('authorization.recoverPassword.empty');
      return;
    }
    if (!this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
      this.message = this.translateService.instant('authorization.recoverPassword.incorrect');
      return;
    }
    this.authenticationService.recoverPassword(this.email).subscribe(n => {
      this.isSent = true;
      this.loading = false;
    },
      error => {
        this.message = error.error ? error.error.message : this.translateService.instant('authorization.login.error');
        this.loading = false;
      });
    this.loading = true;
  }


}
