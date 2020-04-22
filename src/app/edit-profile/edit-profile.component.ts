import { Component, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GetProfileService } from '../_services/get-profile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  private usernameToChange
  ready : boolean
  newAboutMe: string;

  profile

  constructor(private _router: Router, private getProfileService: GetProfileService) {
    this.ready = false;
    this.usernameToChange = history.state.data;
    if (this.usernameToChange === undefined || this.usernameToChange == null) {
      this.usernameToChange = GetProfileService.getCurrentProfile();
    }
  }

  ngOnInit(): void {
    this.getProfileService.getProfile(this.usernameToChange).subscribe(
      result => {
        this.profile = result;
        this.ready = true;
        this.newAboutMe = this.profile.aboutMe;
      },
      error => {
        console.error(error.error);
        this._router.navigate(['/']);
      })
  }


  saveProfile() {
    if (this.newAboutMe !== undefined && this.newAboutMe !== this.profile.aboutMe) {
      this.getProfileService.editProfile('aboutMe', this.newAboutMe).subscribe(
        result => {
          this._router.navigate(['/profile']);
        },
        error => console.log(error.err)
      )
    } else {
      this._router.navigate(['/profile']);

    }
  }

  upload() {
    alert('Picture uploaded')
  }

  cancel() {
    this._router.navigate(['/profile']);
  }



}
