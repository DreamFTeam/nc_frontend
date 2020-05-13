import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetProfileService } from '../_services/get-profile.service';
import { PrivilegedService } from '../_services/privileged.service';
import { Profile } from '../_models/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../_services/authentication.service';
import { QuizService } from '../_services/quiz.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  role: string; // role of the current user
  ready: boolean; // indicates the profile was loaded (doesn't include quizzes)
  owner: boolean; // indicates which rights the user has concerning this profile
  quizzes;
  profile: Profile;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private getProfileService: GetProfileService,
              private privilegedService: PrivilegedService,
              private sanitizer: DomSanitizer,
              private quizService:QuizService,
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
        console.log(JSON.stringify(result));
        this.profile = result;
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
      });
  }


  goToQuiz(id: string) {
    this.router.navigate(['/viewquiz/' + id]);
  }

  markQuizFavourite(quiz: any) {
    quiz.favourite =  !quiz.favourite;
    this.quizService.markAsFavorite(quiz.id).subscribe();
  }


  sendFriendRequest(profile: Profile) {
    this.getProfileService.sendFriendRequest(profile.id).subscribe()
  }


}



