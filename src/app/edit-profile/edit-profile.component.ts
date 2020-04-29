import { Component, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GetProfileService } from '../_services/get-profile.service';
import { PrivilegedService } from '../_services/privileged.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Profile} from '../_models/profile'
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  private usernameToChange
  ready: boolean
  newAboutMe: string;
  profile

  constructor(private _router: Router, private getProfileService: GetProfileService,
    private priviligedService: PrivilegedService,   private sanitizer:DomSanitizer) {
    this.ready = false;
    this.usernameToChange = history.state.data;
    if (this.usernameToChange === undefined
      || this.usernameToChange == null &&
      JSON.parse(localStorage.getItem('userData')).role != 'ROLE_USER') {
      this._router.navigate(['/']);

    } else if (this.usernameToChange === undefined || this.usernameToChange == null) {
      this.usernameToChange = GetProfileService.getCurrentProfile();
    }

  }

  ngOnInit(): void {
    let thiserr = null;
    this.getProfileService.getProfile(this.usernameToChange).subscribe(
      result => {
        this.profile = Profile.deserialize(result, this.sanitizer);
        this.newAboutMe = this.profile.aboutMe;
        this.ready = true;
      },
      error => {
        thiserr = error;
        console.error(error.error);
        this._router.navigate(['/']);
      });


  }


  saveProfile() {
    if (this.profile.role === 'ROLE_USER' && this.newAboutMe !== undefined && this.newAboutMe !== this.profile.aboutMe) {
      this.getProfileService.editProfile('aboutMe', this.newAboutMe).subscribe(
        result => {
          this._router.navigate(['/profile/' + this.usernameToChange]);

        },
        error => console.log(error.err)
      )
    } else if (this.newAboutMe !== undefined && this.newAboutMe !== this.profile.aboutMe) {
      this.priviligedService.edit(this.profile.id, 'aboutMe', this.newAboutMe).subscribe(
        result => {
          this._router.navigate(['/profile/' + this.usernameToChange]);
        },
        error => console.log(error.err)
      )
    }

  }


  upload() {
    alert('Picture uploaded')
  }

  cancel() {
    this._router.navigate(['/profile']);
  }



}
