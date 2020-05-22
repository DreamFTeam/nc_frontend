import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreatePrivilegedComponent} from '../create-privileged/create-privileged.component';
import {AuthenticationService} from '../_services/authentication.service';
import {User} from '../_models/user';

@Component({
  selector: 'app-privileged-profile',
  templateUrl: './privileged-profile.component.html',
  styleUrls: ['./privileged-profile.component.css']
})
export class PrivilegedProfileComponent implements OnInit {
  ready: boolean;
  privilege: string;
  profile: User;

  constructor(private _router: Router, private modalService: NgbModal,
              private authenticationService: AuthenticationService) {
    this.ready = false;
    this.profile = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.ready = true;
  }


  createAdmin() {
    const modalRef = this.modalService.open(CreatePrivilegedComponent);
    modalRef.componentInstance.userrole = 'ROLE_ADMIN';

  }

  createModerator() {
    const modalRef = this.modalService.open(CreatePrivilegedComponent);
    modalRef.componentInstance.userrole = 'ROLE_MODERATOR';

  }
}
