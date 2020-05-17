import { Component, OnInit } from '@angular/core';
import { Profile } from '../_models/profile';

@Component({
  selector: 'app-user-invitations',
  templateUrl: './user-invitations.component.html',
  styleUrls: ['./user-invitations.component.css']
})
export class UserInvitationsComponent implements OnInit {
  activeTab: number;
  role: string; // role of the current user
  ready: boolean; // indicates the profile was loaded (doesn't include quizzes)
  tabReady: boolean;
  invitations: Profile[];
  invitationsSize: number;
  invitationsPage: number;

  constructor() { }

  ngOnInit(): void {
    this.ready = true;
  }


  changeTab(event): void {
    this.activeTab = event;
    this.tabReady = false;

    switch (event.nextId) {
      case 1:
        break;
      case 2:
        break;
    }
    this.tabReady = true;

  }

  load(event): void {
    this.tabReady = false;
    this.tabReady = true;
    window.scrollTo(0, 0);

  }

  getInvitations(direction: string, page: number) {

  }

  getInvitationsSize(direction: string, page: number) {

  }
}
