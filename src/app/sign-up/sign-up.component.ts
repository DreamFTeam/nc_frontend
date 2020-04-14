import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;

  signUp() {
    alert("You asked to change your password! Your email is: " + this.email + ". Your password length is " + this.password.length);
    alert("Your username is " + this.username);
    if (this.password === this.confirmPassword) {
      alert("You wrote two same passwords");
    } else {
      alert("Second password is wrong!!");
    }
  }

}
