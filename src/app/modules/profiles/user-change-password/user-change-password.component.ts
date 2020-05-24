import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent implements OnInit {
  isSent: boolean;
  currentPassword: string;
  password: string;
  confirmPassword: string;
  answer: string;
  loading: boolean;

  constructor(private route: ActivatedRoute,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.isSent = false;
    this.loading = false;
  }

  changePassword() {
    if (this.password.length < 6) {
      alert('Password must be at least 6 symbols long!');
      return;
    }
    if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
      alert('Your password must contain 1 number and 1 letter!');
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Your passwords don\'t match!');
      return;
    }

    this.authenticationService.changeUserPassword(this.currentPassword, this.password).subscribe((n) => {
        this.answer = 'Successfully changed';
        this.isSent = true;
        this.loading = false;
        setInterval(function() {
          location.replace('');
          clearInterval(this);
        }, 5000);
        console.log(n);
      },
      err => {
        this.loading = false;
        console.error(err.error.message);
        this.answer = 'An error occurred';
        this.isSent = true;
      });
    this.loading = true;
  }
}
