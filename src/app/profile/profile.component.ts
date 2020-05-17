import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../_services/profile.service';
import { PrivilegedService } from '../_services/privileged.service';
import { Profile } from '../_models/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../_services/authentication.service';
import { QuizService } from '../_services/quiz.service';
import { FriendsService } from '../_services/friends-service.service';
import { Achievement } from '../_models/achievement';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  activeTab: number;
  role: string; // role of the current user
  ready: boolean; // indicates the profile was loaded (doesn't include quizzes)
  owner: boolean; // indicates which rights the user has concerning this profile
  quizzes;
  profile: Profile;
  tabReady: boolean;
  friends: Profile[];
  achievements: Achievement[];
  friendsSize: number;
  friendsPage: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private friendService: FriendsService,
    private getProfileService: ProfileService,
    private privilegedService: PrivilegedService,
    private sanitizer: DomSanitizer,
    private quizService: QuizService,
    private authenticationService: AuthenticationService,
  ) {
    this.role = authenticationService.currentUserValue.role;
    this.activeTab = 1;
    this.friendsPage = 1;
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue == null) {
      this.router.navigate(['/']);
    }

    this.getProfileService.getProfile(this.getUsername()).subscribe(
      result => {
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

  seeeRequests(type: string) {
    this.router.navigate(['/requests'],
      { state: { data: type } });
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
        this.tabReady = true;
      },
      error => {
        console.error(error.error);
      });
  }


  getFavQuizzes() {

    this.getProfileService.getProfileFavQuiz().subscribe(
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
        this.tabReady = true;
      },
      error => {
        console.error(error.error);
      });
  }


  goToQuiz(id: string) {
    this.router.navigate(['/viewquiz/' + id]);
  }

  markQuizFavourite(quiz: any) {
    quiz.favourite = !quiz.favourite;
    this.quizService.markAsFavorite(quiz.id).subscribe();
    if (this.activeTab === 2) {
      this.quizzes = this.quizzes.filter(item => item !== quiz);
    }
  }

  sendFriendRequest(value: boolean) {
    this.friendService.sendFriendRequest(this.profile.id, value.toString()).subscribe(
      () => this.profile.outgoingRequest = value
    );
  }

  processFriendRequest(value: boolean) {
    this.friendService.processFriendRequest(this.profile.id, value.toString()).subscribe(
      () => {
        this.profile.friend = value;
        this.profile.incomingRequest = false;
      }
    );
  }

  removeFriend() {
    this.friendService.removeFriend(this.profile.id).subscribe(
      () => {
        this.profile.friend = false;
        this.profile.incomingRequest = true;
        this.profile.outgoingRequest = false;

      }
    );
  }


  getFriends(page: number): void {

    this.friendService.getUsersFriends(this.profile.id, page.toString()).subscribe(
      (friends) => {
        this.friends = friends;
        this.tabReady = true;
      }
    );


  }

  getFriendsSize(): void {

    this.friendService.getUsersFriendsSize(this.profile.id).subscribe(
      (size) => {
        this.friendsSize = size;
      }
    );

  }


  getAchievements(): void {

    this.getProfileService.getProfileAchievement(this.profile.id).subscribe(
      (result) => {
        this.achievements = result;
        this.tabReady = true;
      }
    );
  }


  changeTab(event): void {
    this.activeTab = event;
    this.tabReady = false;

    switch (event.nextId) {
      case 1:
        this.getQuizzes();
        break;
      case 2:
        this.getFavQuizzes();
        break;
      case 3:
        this.getAchievements();
        break;
      case 4:
        this.getFriendsSize();
        this.getFriends(1);
    }
  }

  load(event): void {
    this.tabReady = false;
    this.getFriendsSize();
    this.getFriends(event);
    window.scrollTo(0, 250);

  }

}

