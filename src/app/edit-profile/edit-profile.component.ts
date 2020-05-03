import { Component, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GetProfileService } from '../_services/get-profile.service';
import { PrivilegedService } from '../_services/privileged.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Profile } from '../_models/profile'
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
  changedPic: boolean = false;
  file: File

  constructor(private _router: Router, private getProfileService: GetProfileService,
    private priviligedService: PrivilegedService, private sanitizer: DomSanitizer) {
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
    if (this.profile.role === 'ROLE_USER' && this.newAboutMe !== undefined) {

      this.getProfileService.editProfile('aboutMe', this.newAboutMe).subscribe(
        result => {
          this._router.navigate(['/profile/' + this.usernameToChange]);

        },
        error => console.log(error.err)
      )


    } else if (this.newAboutMe !== undefined) {
      this.priviligedService.edit(this.profile.id, 'aboutMe', this.newAboutMe).subscribe(
        result => {
          this._router.navigate(['/profile/' + this.usernameToChange]);

        },
        error => console.log(error.err)
      )

    } else {
      this._router.navigate(['/profile/' + this.usernameToChange]);
    }
  }


  cancel() {
    this._router.navigate(['/profile']);
  }


  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      if (event.target.files[0].type !== 'image/jpeg' && event.target.files[0].type !== 'image/png') {
        alert('Your file must be an image, try other file.')
        event.target.result = null;
        return;
      }

      this.file = event.target.files[0]
      if (confirm("Are u sure u want to upload this photo?")) {
        reader.onload = event => { // called once readAsDataURL is completed

          this.profile.imageContent = event.target.result;
          this.changedPic = true;
          this.uploadPic();
        };
      } else {
        event.target.files[0] = null;
        event.target.result = null;

        this.file = null;
      }
    }

  }


  uploadPic() {
    let newPic = new FormData();
    newPic.append('key', this.file)

    if (this.profile.role === 'ROLE_USER') {
      this.getProfileService.uploadPicture(newPic).subscribe(
        result => {
          this._router.navigate(['/profile/' + this.usernameToChange]);

        },
        error => console.log(error.err)
      )
    } else {

      newPic.append('userId', this.profile.id)

      this.priviligedService.uploadPicture(newPic).subscribe(
        result => {
          this._router.navigate(['/profile/' + this.usernameToChange]);

        },
        error => console.log(error.err)
      )
    }
  }
}
