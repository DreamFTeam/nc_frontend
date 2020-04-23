import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  isSent: boolean;
  loading: boolean;

  constructor(private authenticationService: AuthenticationService,
              public activeModal: NgbActiveModal, private _router: Router) {
  }

  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  message: string;
  signUp() {
    if (this.username == '' || this.username == null) {
      alert('Enter the username!');
      return;
    }
    if (!this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
      alert('You wrote an incorrect email!');
      return;
    }
    if (this.password.length < 6) {
      alert('Password must be at least 6 symbols long!');
      return;
    }
    if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
      alert('Your password must contain 1 number and 1 letter!');
      return;
    }
    if (this.password != this.confirmPassword) {
      alert('Your passwords don\'t match!');
      return;
    }
    /*Code for comunication with back-end*/
    this.authenticationService.signupUser(this.username, this.email, this.password)
      .subscribe(n => {
          if (n) {
            this.isSent = true;
          }
        },
        err => {
          this.message = err.error.message;
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
