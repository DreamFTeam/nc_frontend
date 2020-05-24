import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../_services/authentication.service';

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
    public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.isSent = false;
    this.loading = false;
  }

  requestPasswordChange() {
    if (this.email == '' || this.email == null) {
      this.message = ('Enter the email!');
      return;
    }
    if (!this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
      this.message = ('You wrote an incorrect email!');
      return;
    }
    this.authenticationService.recoverPassword(this.email).subscribe(n => {
        this.isSent = true;
        this.loading = false;
      },
      error => {
        this.message = error.error ? error.error.message : 'An error occurred';
        this.loading = false;
      });
    this.loading = true;
  }


}
