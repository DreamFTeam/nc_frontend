import { Component } from '@angular/core';
import { AuthenticationService } from '../../core/_services/authentication.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecoverPasswordComponent } from '../recover-password/recover-password.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  constructor(private authenticationService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private _router: Router) {
  }

  email = '';
  password = '';
  loading: boolean;
  message: string;


  logIn() {
    if (this.email === '' || this.email == null) {
      this.message = ('Enter the username!');
      return;
    }
    if (this.password === '' || this.password == null) {
      this.message = ('Enter the password!');
      return;
    }

    /*Code for comunication with back-end*/
    this.authenticationService.loginUser(this.email, this.password)
      .subscribe(n => {
        location.reload();
        this.loading = false;
      },
        error => {
          this.message = error;
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
