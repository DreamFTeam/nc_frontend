import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../core/_services/profile/profile.service';
import { PrivilegedService } from '../../core/_services/admin/privileged.service';
import { Profile } from '../../core/_models/profile';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { QuizService } from '../../core/_services/quiz/quiz.service';
import { FriendsService } from '../../core/_services/profile/friends-service.service';
import { Achievement } from '../../core/_models/achievement';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { YesNoModalComponent } from '../../shared/yes-no-modal/yes-no-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ExtendedQuiz } from '../../core/_models/extended-quiz';
import { Subscription } from 'rxjs';
import { DateService } from '../../core/_services/utils/date.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  activeTab: number;
  MAX_AMOUNT: number; // amount of friends per page
  role: string; // role of the current user
  username: string;
  targetUsername: string;
  ready: boolean; // indicates the profile was loaded (doesn't include quizzes)
  owner: boolean; // indicates which rights the user has concerning this profile
  quizzes: ExtendedQuiz[];
  profile: Profile;
  tabReady: boolean;
  friends: Profile[];
  achievements: Achievement[];
  friendsSize: number;
  friendsPage: number;
  outGoingAmount: number;
  incomingAmount: number;
  favQuizAmount: number;
  quizAmount: number;
  achievementsSize: number;
  faSpinner = faSpinner;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private friendService: FriendsService,
    private getProfileService: ProfileService,
    private privilegedService: PrivilegedService,
    private quizService: QuizService,
    private authenticationService: AuthenticationService,
    private toastsService: ToastsService,
    private localeService: LocaleService,
    private modalService: NgbModal,
    public dateService: DateService
  ) {
    if (this.route.snapshot.paramMap.get('page')) {
      this.router.navigate(['/profile/' + this.route.snapshot.paramMap.get('username')],
        { state: { data: this.route.snapshot.paramMap.get('page').toString() } });
    }
    this.role = authenticationService.currentUserValue.role;
    this.username = authenticationService.currentUserValue.username;
    this.friendsPage = 1;
    this.MAX_AMOUNT = getProfileService.AMOUNT_OF_USERS;
    this.activeTab = history.state.data || 1;

  }


  ngOnInit(): void {
    if (this.authenticationService.currentUserValue == null) {
      this.router.navigate(['/']);
    }
    this.subscriptions.push(
      this.route.params
        .subscribe(params => {
          this.targetUsername = params.username || this.username;
          this.getProfile();

        }));

  }

  private getAllBadgesInfo() {
    this.getFriendsSize();
    this.getAllQuizzesAmount();
    this.getAchievementsAmount();
    if (this.role === 'ROLE_USER') {
      this.getInvitationsSize();
    }
  }

  getProfile() {
    this.subscriptions.push(this.getProfileService.getProfile(this.targetUsername).subscribe(
      result => {
        this.profile = result;

      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }).add(() => {
        this.setRights();
        if (this.profile.role === 'ROLE_USER') {
          this.getAllBadgesInfo();
          this.changeTab({ nextId: history.state.data || 1 });
          this.activeTab = parseInt(history.state.data, 10) || 1;
        }
        this.ready = true;
      }
      ));
  }

  private setRights() {
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

    this.modal(this.localeService.getValue('modal.changeRoleUser'), 'danger')
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          this.subscriptions.push(this.privilegedService.edit(this.profile.id, 'role', isAnUpgrade).subscribe(result => {
            this.toastsService.toastAddSuccess('Privileges have been changed');
            window.location.reload();

          },
            (error) => {
              this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

            }));
        }
      });

  }

  deactivate(bool: boolean) {
    this.modal(this.localeService.getValue('modal.deactivateUser'), 'danger')
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          this.subscriptions.push(this.privilegedService.deactivate(this.profile.id, bool).subscribe(result => {
            this.toastsService.toastAddSuccess('User`s activation status changed');
            window.location.reload();

          },
            (error) => {
              this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));
            }));
        }
      });

  }

  private modal(text, style): any {
    const modalRef = this.modalService.open(YesNoModalComponent);
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.style = style;

    return modalRef.componentInstance.passEntry;
  }

  private getInvitationsSize() {
    this.subscriptions.push(this.friendService.getUsersInvitationsSize('outgoing').subscribe(
      (result) => {
        this.outGoingAmount = result;
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));

    this.subscriptions.push(this.friendService.getUsersInvitationsSize('incoming').subscribe(
      (result) => {
        this.incomingAmount = result;
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));
  }

  private getQuizzes() {
    this.subscriptions.push(this.getProfileService.getProfileQuiz(this.profile.id).subscribe(
      result => {
        this.quizzes = result;
        this.tabReady = true;
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));
  }


  private getAchievementsAmount() {

    this.subscriptions.push(this.getProfileService.getProfileAchievementAmount(this.profile.id).subscribe(
      (result) => {
        this.achievementsSize = result;
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));

  }

  private getAllQuizzesAmount() {

    this.subscriptions.push(this.getProfileService.getProfileQuizAmount(this.profile.id).subscribe(
      result => {
        this.quizAmount = result;
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));

    this.subscriptions.push(this.getProfileService.getProfileFavQuizAmount().subscribe(
      result => {
        this.favQuizAmount = result;
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));
  }

  private getFavQuizzes() {

    this.subscriptions.push(this.getProfileService.getProfileFavQuiz().subscribe(
      result => {
        this.quizzes = result;
        this.tabReady = true;
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }));
  }


  goToQuiz(id: string) {
    this.router.navigate(['/viewquiz/' + id]);
  }



  markQuizFavourite(quiz: any) {
    if (quiz.favourite && this.activeTab === 2) {
      this.modal(this.localeService.getValue('modal.removeQuizFromFav'), 'danger')
        .subscribe((receivedEntry) => {
          if (receivedEntry) {
            this.markQuiz(quiz);
          }
        });
    } else {
      this.markQuiz(quiz);
    }

  }

  private markQuiz(quiz: any) {
    quiz.favourite = !quiz.favourite;
    this.subscriptions.push(this.quizService.markAsFavorite(quiz.id).subscribe());
    this.favQuizAmount += (quiz.favourite) ? 1 : -1;

    if (this.activeTab === 2) {
      this.quizzes = this.quizzes.filter(item => item !== quiz);
    }
  }

  sendFriendRequest(value: boolean) {

    this.modal(this.localeService.getValue('modal.sendRequest'), 'danger')
      .subscribe((receivedEntry) => {
        if (receivedEntry) {

          this.subscriptions.push(this.friendService.sendFriendRequest(this.profile.id, value.toString()).subscribe(
            () => this.profile.outgoingRequest = value,
            (error) => {
              this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));
            }
          ));
        }
      });
  }

  processFriendRequest(value: boolean) {
    this.modal(this.localeService.getValue(value ? 'modal.acceptRequest' : 'modal.rejectRequest'), 'danger')
      .subscribe((receivedEntry) => {
        if (receivedEntry) {

          this.subscriptions.push(this.friendService.processFriendRequest(this.profile.id, value.toString()).subscribe(
            () => {
              this.profile.friend = value;
              this.profile.incomingRequest = false;
            },
            (error) => {
              this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

            }
          ));
        }
      });
  }

  removeFriend() {

    this.modal(this.localeService.getValue('modal.removeFriend'), 'danger')
      .subscribe((receivedEntry) => {
        if (receivedEntry) {

          this.subscriptions.push(this.friendService.removeFriend(this.profile.id).subscribe(
            () => {
              this.profile.friend = false;
              this.profile.incomingRequest = true;
              this.profile.outgoingRequest = false;

            },
            (error) => {
              this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

            }
          ));
        }
      });

  }


  getFriends(page: number): void {

    this.subscriptions.push(this.friendService.getUsersFriends(this.profile.id, page.toString()).subscribe(
      (friends) => {
        this.friends = friends;
        this.tabReady = true;
      },
      (error) => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }
    ));


  }

  private getFriendsSize(): void {

    this.subscriptions.push(this.friendService.getUsersFriendsSize(this.profile.id).subscribe(
      (size) => {
        this.friendsSize = size;
      },
      error => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }
    ));

  }


  private getAchievements(): void {

    this.subscriptions.push(this.getProfileService.getProfileAchievement(this.profile.id).subscribe(
      (result) => {
        this.achievements = result;
        this.tabReady = true;
      },
      error => {
        this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

      }
    ));
  }


  changeTab(event): void {
    this.activeTab = event;
    this.tabReady = false;
    switch (event.nextId.toString()) {
      case '1':
        this.getQuizzes();
        break;
      case '2':
        this.getFavQuizzes();
        break;
      case '3':
        this.getAchievements();
        break;
      case '4':
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
