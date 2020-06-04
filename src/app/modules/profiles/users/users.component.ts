import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../core/_services/profile/profile.service';
import { Profile } from '../../core/_models/profile';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { DateService } from '../../core/_services/utils/date.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  searchResults: Profile[];
  username: string;
  currentUsername: string;
  privileged: boolean;
  faSpinner = faSpinner;
  ready: boolean;
  init: boolean;


  constructor(private getProfileService: ProfileService,
              private authenticationService: AuthenticationService,
              private toastsService: ToastsService,
              private localeService: LocaleService,
              public dateService: DateService

  ) {
    this.searchResults = null;
    this.currentUsername = this.authenticationService.currentUserValue.username;
    this.privileged = authenticationService.currentUserValue.role !== 'ROLE_USER';
    this.init = true;
  }


  ngOnInit(): void {
    if (this.privileged) {
      this.getPrivilegedUsers();
    } else {
      this.getPopularCreators();

    }
  }

  search() {
    this.ready = false;
    this.init = false;

    this.subscriptions.push(this.getProfileService.getProfilebyUserName(this.username === undefined ? '' : this.username).subscribe(
      data => {
        this.searchResults = data;
        this.ready = true;

      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));
  }

  getPopularCreators() {
    this.ready = false;

    this.subscriptions.push(this.getProfileService.getPopularCreators().subscribe(
      data => {
        this.searchResults = data;
        this.ready = true;

      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));
  }

  getPrivilegedUsers() {
    this.ready = false;

    this.subscriptions.push(this.getProfileService.getPrivilegedUsers().subscribe(
      data => {
        this.searchResults = data;
        this.ready = true;

      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
