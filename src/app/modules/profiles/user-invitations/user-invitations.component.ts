import { Component, OnInit } from '@angular/core';
import { Profile } from '../../core/_models/profile';
import { FriendsService } from '../../core/_services/profile/friends-service.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YesNoModalComponent } from '../../shared/yes-no-modal/yes-no-modal.component';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

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
  incomingInvitationsSize: number;
  outgoingInvitationsSize: number;
  invitationsPage: number;
  faSpinner = faSpinner;

  constructor(
    private friendService: FriendsService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastsService: ToastsService,
    private localeService: LocaleService,
    private modalService: NgbModal,
  ) {
    this.ready = true;
    this.MAX_AMOUNT = friendService.AMOUNT_OF_USERS;
    this.activeTab = history.state.data === 'outgoing' ? 2 : 1;
    this.invitationsPage = 1;

    this.getInvitationsSize('incoming');
    this.getInvitationsSize('outgoing');
    this.getInvitations(history.state.data || 'incoming', 1);
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue == null) {
      this.router.navigate(['/']);
    }

  }

  changeTab(event): void {
    this.activeTab = event;
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
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      });

  }

  private getInvitationsSize(direction: string) {
    this.friendService.getUsersInvitationsSize(direction).subscribe(
      (result) => {
        if (direction === 'outgoing') {
          this.outgoingInvitationsSize = result;
        } else {
          this.incomingInvitationsSize = result;
        }
      }
    );
  }


  processFriendRequest(profile: Profile, value: boolean) {
    this.modal(this.localeService.getValue(value ? 'modal.acceptRequest' : 'modal.rejectRequest'), 'danger')
      .subscribe((receivedEntry) => {
        if (receivedEntry) {

          this.friendService.processFriendRequest(profile.id, value.toString()).subscribe(
            () => {
              this.invitations = this.invitations.filter(item => item !== profile);
              this.load(this.invitationsPage);
              this.tabReady = true;

            },
            (error) => {
              this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

            });
        }
      });

  }

  sendFriendRequest(profile: Profile, value: boolean) {
    this.modal(this.localeService.getValue('modal.rejectRequest'), 'danger')
      .subscribe((receivedEntry) => {
        if (receivedEntry) {

          this.friendService.sendFriendRequest(profile.id, value.toString()).subscribe(
            () => {
              this.invitations = this.invitations.filter(item => item !== profile);
              this.load(this.invitationsPage);
              this.tabReady = true;
            },
            (error) => {
              this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

            });
        }
      });


  }


  private modal(text, style): any {
    const modalRef = this.modalService.open(YesNoModalComponent);
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.style = style;
    return modalRef.componentInstance.passEntry;
  }

}
