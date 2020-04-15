import { Component } from '@angular/core';
import { Router }  from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  constructor(private _router: Router){}

  email: string = "";
  password: string = "";

  logIn() {
    if (this.email == "" || this.email == null) {
      alert("Enter the email or username!");
      return;
    }
    if (this.password == "" || this.password == null) {
      alert("Enter the password!");
      return;
    }
    /*Code for comunication with back-end*/
  }

  goHomePage(): void {
    this._router.navigate(['/']);
  }
}
