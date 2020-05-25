import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/_services/profile/profile.service';
import { PrivilegedService } from '../../core/_services/admin/privileged.service';
import { Profile } from '../../core/_models/profile';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  @ViewChild('fileinput')
  fileInput: ElementRef;

  private usernameToChange: string;
  private profilePictureFile: File;

  profile: Profile;
  ready: boolean; // indicates the data was loaded and can be shown


  constructor(private router: Router,
              private getProfileService: ProfileService,
              private priviligedService: PrivilegedService,
              private authenticationService: AuthenticationService) {

    if (!this.setUsername()) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit(): void {
    this.getProfileService.getProfile(this.usernameToChange).subscribe(
      result => {
        this.profile = result;
        this.ready = true;
      },
      error => {
        console.error(error.error);
        this.router.navigate(['/']);
      });

  }


  setUsername(): boolean { // returns true if could identify the profile to change
    this.usernameToChange = history.state.data;

    // only users are capable of changing their own profile
    // thus only they can use the /editprofile shortcut
    if (!this.usernameToChange && this.authenticationService.currentUserValue.role === 'ROLE_USER') {
      this.usernameToChange = this.authenticationService.currentUserValue.username;
    }

    return this.usernameToChange !== null;
  }

  saveProfile() {
    if (this.profile.role === 'ROLE_USER') {

      this.getProfileService.editProfile('aboutMe', this.profile.aboutMe).subscribe(
        () => {
          this.uploadPic();
        },
        error => {
          console.log(error.err);
          this.goBackToProfile();
        }
      );
    } else {
      this.priviligedService.edit(this.profile.id, 'aboutMe', this.profile.aboutMe).subscribe(
        () => {
          this.uploadPic();
        },
        error => {
          console.log(error.err);
          this.goBackToProfile();

        });
    }
  }

  goBackToProfile() {
    this.router.navigate(['/profile/' + this.usernameToChange]);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if (event.target.files[0].type !== 'image/jpeg'
        && event.target.files[0].type !== 'image/png') {
        alert('Your file must be an image, try other file.'); 
        this.fileInput.nativeElement.value = null;
        return;
      }

      this.profilePictureFile = event.target.files[0];

      reader.onload = (value) => { // called once readAsDataURL is completed
        this.profile.image = value.target.result;
      };
    }
  }

  uploadPic(): void {
    if (!this.profilePictureFile) {
      this.goBackToProfile();
    }

    const newPic = new FormData();
    newPic.append('key', this.profilePictureFile);

    if (this.profile.role === 'ROLE_USER') {
      this.getProfileService.uploadPicture(newPic).subscribe(
        () => {
          this.goBackToProfile();
        },
        error =>
          alert('We couldn`t upload your picture, please, try again.')
      );
    } else {

      newPic.append('userId', this.profile.id); // required to change moderator's or admin's profile

      this.priviligedService.uploadPicture(newPic).subscribe(
        () => {
          this.goBackToProfile();
        },
        error => {
          alert('We couldn`t upload your picture, please, try again.');
        }
      );
    }
  }
}
