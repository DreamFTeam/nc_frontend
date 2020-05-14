import {Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {ExtendedQuizPreview} from '../_models/extendedquiz-preview';
import {QuizListService} from '../_services/quiz-list.service';
import {ModalMessageService} from '../_services/modal-message.service';
import {GameSettingsService} from '../_services/game-settings.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {Role} from '../_models/role';


const PAGE_SIZE = 16;

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  page: number;
  pageSize: number;
  accessCode: string;
  searchInput: string;

  totalSize$: Observable<number>;
  quizList$: Observable<ExtendedQuizPreview[]>;
  mockImageUrl = '../../assets/img/quiz.jpg';
  accessCodeLoading: boolean;
  canCreate: boolean;
  admin: boolean;

  constructor(private quizListService: QuizListService,
              private modalMessageService: ModalMessageService,
              private gameSettingsService: GameSettingsService,
              private router: Router,
              private authenticationService: AuthenticationService) {
    this.pageSize = PAGE_SIZE;
    this.page = 1;
  }

  ngOnInit(): void {
    this.getTotalSize();
    this.getQuizzes(this.page);
    this.canCreate = this.authenticationService.currentUserValue != null;
    this.admin = this.authenticationService.currentUserValue
      && this.authenticationService.currentUserValue.role !== Role.User;
  }

  getQuizzes(p: number): void {
    this.quizList$ = this.quizListService.getQuizzesByPage(p);
  }

  getTotalSize(): void {
    this.totalSize$ = this.quizListService.getTotalSize();
    this.totalSize$.subscribe(ans => console.log(ans));
  }

  loadPage(event) {
    this.getQuizzes(event);
    this.scrollToTop();
  }

  scrollToTop() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 40);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  join() {
    this.accessCodeLoading = true;
    this.router.navigateByUrl('/join/' + this.accessCode);
  }

  search() {

  }
}
