import { Component, OnInit , Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {PrivilegedService} from '../../core/_services/privileged.service'

@Component({
  selector: 'app-create-privileged',
  templateUrl: './create-privileged.component.html',
  styleUrls: ['./create-privileged.component.css']
})
export class CreatePrivilegedComponent implements OnInit {
  @Input() public userrole;

  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  constructor(public activeModal: NgbActiveModal, public privilegedService :PrivilegedService) { }

  ngOnInit(): void {
  }

  create() {
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
      alert('Password must contain 1 number and 1 letter!');
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Passwords don\'t match!');
      return;
    }
    /*Code for comunication with back-end*/
    this.privilegedService.create(this.username, this.email, this.password, this.userrole)
      .subscribe(result => {
        this.activeModal.dismiss('Cross click');
        alert('Notify the ' + this.userrole.substr(5).toLowerCase());
      },
       error => {console.log(error)
       this.activeModal.dismiss('Cross click');
       alert('An error occured, try again');
         }  );
   }

}
