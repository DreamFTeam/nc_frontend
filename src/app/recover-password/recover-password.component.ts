import { Component } from '@angular/core';
import { Router }  from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {


  constructor(private _router: Router){}

  email: string;

  requestPasswordChange() {
    if (this.email == "" || this.email == null) {
      alert("Enter the email!");
      return;
    }
    if (!this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
      alert("You wrote an incorrect email!");
      return;
    }
    /*Code for comunication with back-end*/
  }

  goHomePage(): void {
    this._router.navigate(['/']);
  }

}
