import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CreatePrivilegedComponent} from '../create-privileged/create-privileged.component'
@Component({
  selector: 'app-privileged-profile',
  templateUrl: './privileged-profile.component.html',
  styleUrls: ['./privileged-profile.component.css']
})
export class PrivilegedProfileComponent implements OnInit {
  ready: boolean;
  privilege : string;
  profile;

  constructor(private _router: Router, private modalService: NgbModal) {
    this.ready = false;
  }

  ngOnInit(): void {
    if (localStorage.getItem('userData') == null ||
      JSON.parse(localStorage.getItem('userData')).role == 'ROLE_USER') {
      this._router.navigate(['/']);
    }
    this.profile = JSON.parse(localStorage.getItem('userData'));
    this.ready = true;
  }


  createAdmin() {
    const modalRef = this.modalService.open(CreatePrivilegedComponent);
    modalRef.componentInstance.userrole = 'ROLE_ADMIN'

  }

  createModerator() {
    const modalRef = this.modalService.open(CreatePrivilegedComponent);
    modalRef.componentInstance.userrole = 'ROLE_MODERATOR'

  }
}
