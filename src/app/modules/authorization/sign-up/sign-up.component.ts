import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMessageService } from '../../core/_services/utils/modal-message.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  isSent: boolean;
  loading: boolean;

  constructor(private authenticationService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private modalMessageService: ModalMessageService) {
  }

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  message: string;

  signUp() {
    if (this.username == '' || this.username == null) {
      this.message = 'Enter the username!';
      return;
    }
    if (!this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
      this.message = ('You wrote an incorrect email!');
      return;
    }
    if (this.password.length < 6) {
      this.message = ('Password must be at least 6 symbols long!');
      return;
    }
    if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
      this.message = ('Your password must contain 1 number and 1 letter!');
      return;
    }
    if (this.password != this.confirmPassword) {
      this.message = ('Your passwords don\'t match!');
      return;
    }
    this.authenticationService.signupUser(this.username, this.email, this.password)
      .subscribe(n => {
        if (n) {
          this.isSent = true;
          this.activeModal.close();
          this.modalMessageService.show('Mail', 'Check your email!');
        }
      },
        err => {
          this.message = err;
          this.loading = false;
        }
      );
    this.loading = true;
  }

  ngOnInit(): void {
    this.isSent = false;
    this.loading = false;
  }


}
