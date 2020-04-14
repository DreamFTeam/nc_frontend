import { Component } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  email: string = "";
  password: string = "";

  logIn() {
    alert("You asked to change your password! Your email is: " + this.email + ". Your password length is " + this.password.length);
  }
}
