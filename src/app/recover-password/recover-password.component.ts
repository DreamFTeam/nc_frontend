import { Component } from '@angular/core';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  email: string;

  requestPasswordChange() {
    alert("You asked to change your password! Your email is: " + this.email);
  }
}
