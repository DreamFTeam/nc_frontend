import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/_services/profile/profile.service';
import { Profile } from '../../core/_models/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  searchResults: Profile[];
  username: string;
  currentUsername: string;
  privileged: boolean;

  constructor(private getProfileService: ProfileService,
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    private toastsService: ToastsService,
    private localeService: LocaleService

  ) {
    this.searchResults = null;
    this.currentUsername = this.authenticationService.currentUserValue.username;
    this.privileged = authenticationService.currentUserValue.role !== 'ROLE_USER';

  }


  ngOnInit(): void {
    if (this.privileged) {
      this.getPrivilegedUsers();
    } else {
      this.getPopularCreators();

    }
  }

  search() {
    this.getProfileService.getProfilebyUserName(this.username).subscribe(
      data => {
        this.searchResults = data;
        this.searchResults.forEach(element => {
          return Profile.deserialize(element, this.sanitizer);
        });
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      });
  }

  getPopularCreators() {
    this.getProfileService.getPopularCreators().subscribe(
      data => {
        this.searchResults = data;
        this.searchResults.forEach(element => {
          return Profile.deserialize(element, this.sanitizer);
        });
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      });
  }

  getPrivilegedUsers() {
    this.getProfileService.getPrivilegedUsers().subscribe(
      data => {
        this.searchResults = data;
        this.searchResults.forEach(element => {
          return Profile.deserialize(element, this.sanitizer);
        });
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      });
  }

}
