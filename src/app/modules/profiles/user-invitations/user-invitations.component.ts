import { Component, OnInit } from '@angular/core';
import { Profile } from '../../core/_models/profile';
import { FriendsService } from '../../core/_services/friends-service.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/_services/authentication.service';

@Component({
  selector: 'app-user-invitations',
  templateUrl: './user-invitations.component.html',
  styleUrls: ['./user-invitations.component.css']
})
export class UserInvitationsComponent implements OnInit {
  MAX_AMOUNT: number;
  activeTab: number;
  role: string; // role of the current user
  ready: boolean; // indicates the profile was loaded (doesn't include quizzes)
  tabReady: boolean;
  invitations: Profile[];
  invitationsSize: number;
  invitationsPage: number;

  constructor(
    private friendService: FriendsService,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    this.ready = true;
    this.MAX_AMOUNT = friendService.AMOUNT_OF_USERS;
    this.activeTab = history.state.data === 'outgoing' ? 2 : 1;
    this.invitationsPage = 1;
    this.getInvitationsSize(history.state.data || 'incoming');
    this.getInvitations(history.state.data || 'incoming', 1);
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue == null) {
      this.router.navigate(['/']);
    }

  }

  changeTab(event): void {
    this.activeTab = event;
    this.invitations = null;
    this.tabReady = false;
    const value = (event.nextId === 1) ? 'incoming' : 'outgoing';

    this.getInvitationsSize(value);
    this.getInvitations(value, 1);

  }

  load(event): void {
    this.tabReady = false;
    const value = (this.activeTab === 1) ? 'incoming' : 'outgoing';
    this.getInvitationsSize(value);
    this.getInvitations(value, event);

  }

  getInvitations(direction: string, page: number) {
    this.friendService.getUsersInvitationsPage(direction, page).subscribe(
      (result) => {
        this.invitations = result;
        this.tabReady = true;
      }
    );
  }

  getInvitationsSize(direction: string) {
    this.friendService.getUsersInvitationsSize(direction).subscribe(
      (result) => {
        this.invitationsSize = result;
      }
    );
  }


  processFriendRequest(profile: Profile, value: boolean) {
    this.friendService.processFriendRequest(profile.id, value.toString()).subscribe(
      () => {
        this.invitations = this.invitations.filter(item => item !== profile);
        this.load(this.invitationsPage);
        this.tabReady = true;

      }
    );
  }

  sendFriendRequest(profile: Profile, value: boolean) {
    this.friendService.sendFriendRequest(profile.id, value.toString()).subscribe(
      () => {
        this.invitations = this.invitations.filter(item => item !== profile);
        this.load(this.invitationsPage);
        this.tabReady = true;
      });
  }


}
