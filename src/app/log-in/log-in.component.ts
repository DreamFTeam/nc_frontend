import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  constructor(private _router: Router,
    private authenticationService: AuthenticationService,
    public activeModal: NgbActiveModal) {
  }

  email = '';
  password = '';


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
    this.authenticationService.loginUser(this.email, this.password).pipe()
      .subscribe(n => {
        this.activeModal.dismiss('Cross click');
        window.location.reload();
      }
      );
  }
}
