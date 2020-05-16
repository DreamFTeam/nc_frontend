import {Component} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RecoverPasswordComponent} from '../recover-password/recover-password.component';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  constructor(private authenticationService: AuthenticationService,
              public activeModal: NgbActiveModal,
              private modalService: NgbModal) {
  }

  email = '';
  password = '';
  loading: boolean;
  message: string;


  logIn() {
    if (this.email === '' || this.email == null) {
      alert('Enter the email or username!');
      return;
    }
    if (this.password === '' || this.password == null) {
      alert('Enter the password!');
      return;
    }

    /*Code for comunication with back-end*/
    this.authenticationService.loginUser(this.email, this.password)
      .subscribe(n => {
          location.reload();
          this.loading = false;
        },
        error => {
          if (error.error) {
            this.message = error.error.message;
          } else {
            this.message = 'An error occurred';
          }
          console.log(error);
          this.loading = false;
        }
      )
    ;
    this.loading = true;
  }

  openRecover() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(RecoverPasswordComponent);
  }
}
