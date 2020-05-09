import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LogInComponent} from '../log-in/log-in.component';
import {SignUpComponent} from '../sign-up/sign-up.component';
import {AuthenticationService} from '../_services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public isMenuCollapsed = true;
  public signedIn;
  public privileged;
  constructor(private modalService: NgbModal,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.signedIn = (localStorage.getItem('userData') == null) ? false : true;
    this.privileged = (this.signedIn &&
      JSON.parse(localStorage.getItem('userData')).role !== 'ROLE_USER') ? true : false;
  }


  openLogin() {
    this.isMenuCollapsed = true;
    const modalRef = this.modalService.open(LogInComponent);
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  openReg() {
    this.isMenuCollapsed = true;
    const modalRef = this.modalService.open(SignUpComponent, { size: 'lg' });

  }

  logout() {
    this.isMenuCollapsed = true;
    this.authenticationService.signoutUser();
    window.location.reload();
  }
}
