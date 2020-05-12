import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetProfileService } from '../_services/get-profile.service';
import { PrivilegedService } from '../_services/privileged.service';
import { Quiz } from '../_models/quiz';
import { Profile } from '../_models/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../_services/authentication.service';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { ExtendedQuizPreview } from '../_models/extendedquiz-preview';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  role: string; // role of the current user
  privileged: boolean; // indicates whether it is privileged to privileged relation
  ready: boolean; // indicates the profile was loaded (doesn't include quizzes)
  owner: boolean; // indicates which rights the user has concerning this profile
  quizzes;
  profile: Profile;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private getProfileService: GetProfileService,
              private privilegedService: PrivilegedService,
              private sanitizer: DomSanitizer,
              private authenticationService: AuthenticationService,
  ) {
    this.role = authenticationService.currentUserValue.role;
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue == null) {
      this.router.navigate(['/']);
    }

    this.getProfileService.getProfile(this.getUsername()).subscribe(
      result => {
        this.profile = Profile.deserialize(result, this.sanitizer);
        this.setRights();

        if (this.profile.role === 'ROLE_USER') {
          this.getQuizzes();
        }

        this.ready = true;

      },
      error => {
        console.error(error.error);
        this.router.navigate(['/']);
      });
  }

  getUsername(): string {
    return this.route.snapshot.paramMap.get('username') || this.authenticationService.currentUserValue.username;
  }

  setRights() {
    this.owner =
      this.authenticationService.currentUserValue.username === this.profile.username &&
      this.role === 'ROLE_USER' ||
      this.getProfileService.compare(this.role, this.profile.role);

    if (this.role !== 'ROLE_USER' && this.profile.role !== 'ROLE_USER') {
      this.privileged = true;
    }
  }

  edit() {
    this.router.navigate(['/editprofile'],
        { state: { data: this.profile.username } });
  }

  editAdmin(isAnUpgrade: boolean) {
    this.privilegedService.edit(this.profile.id, 'role', isAnUpgrade).subscribe(result => {
      alert('Privileges have been changed');
      window.location.reload();

    },
      error => {
        console.log(error);
        alert('An error occured, try again');
      });
  }

  deactivate(bool: boolean) {
    this.privilegedService.deactivate(this.profile.id, bool).subscribe(result => {
      alert('User`s activation status changed');
      window.location.reload();

    },
      error => {
        console.log(error);
        alert('An error occured, try again');
      });
  }


  getQuizzes() {

    this.getProfileService.getProfileQuiz(this.profile.id).subscribe(
      result => {
        result.forEach(input => {
          if (input['imageContent'] !== null) {
            input['imageContent'] =
              this.sanitizer.bypassSecurityTrustUrl
              ('data:image\/(png|jpg|jpeg);base64,'
                + input['imageContent']);
          }
          return input;
        });
        this.quizzes = result;
      },
      error => {
        console.error(error.error);
        this.ready = true;
      });
  }


  goToQuiz(id: string) {
    this.router.navigate(['/viewquiz/' + id]);
  }

}


