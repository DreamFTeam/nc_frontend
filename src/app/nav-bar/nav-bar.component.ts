import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogInComponent } from '../log-in/log-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public signedIn;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.signedIn = (localStorage.getItem('userData') == null) ? false : true;
  }


  openLogin() {
    const modalRef = this.modalService.open(LogInComponent);
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  openReg() {
    const modalRef = this.modalService.open(SignUpComponent, { size: 'lg' });

  }
}
