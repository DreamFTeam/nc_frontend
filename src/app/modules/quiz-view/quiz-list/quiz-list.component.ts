import { Component, OnInit } from '@angular/core';
import { ExtendedQuizPreview } from '../../core/_models/extendedquiz-preview';
import { GameSettingsService } from '../../core/_services/game/game-settings.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { Role } from '../../core/_models/role';
import { SearchFilterQuizService } from '../../core/_services/quiz/search-filter-quiz.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizFilterComponent } from '../quiz-filter/quiz-filter.component';
import { LocaleService } from '../../core/_services/utils/locale.service';


const PAGE_SIZE = 16;

@Component({
    selector: 'app-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
    accessCode: string;
    accessCodeLoading: boolean;
    admin: boolean;
    searchInput: string;

    canCreate: boolean;

    page: number;
    pageSize: number;
    quizList: ExtendedQuizPreview[] = [];
    mockImageUrl = '../../assets/img/quiz.jpg';
    totalSize: number;

    constructor(private modalService: NgbModal,
        private gameSettingsService: GameSettingsService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private searchFilterQuizService: SearchFilterQuizService,
        private localeService: LocaleService) {
        this.pageSize = PAGE_SIZE;
        this.page = 1;
    }

    ngOnInit(): void {
        if (!this.searchFilterQuizService.getSettings().quizLang) {
            this.searchFilterQuizService.initSettings();
        }
        this.searchFilterQuizService.filterQuiz(this.page).subscribe();
        this.searchFilterQuizService.currentQuizzes.subscribe(quizzes => {
            if (quizzes) {
                this.quizList = quizzes;
            }
        });
        this.searchInput = this.searchFilterQuizService.getSettings().quizName;
        this.searchFilterQuizService.currentQuizzesSize.subscribe(size =>
            this.totalSize = size);

        const user = this.authenticationService.currentUserValue;

        this.canCreate = user && user.role === Role.User;

        this.admin = user && user.role !== Role.User;
    }

    loadPage(event) {
        this.searchFilterQuizService.filterQuiz(event).subscribe();
        this.scrollToTop();
    }

    scrollToTop() {
        const scrollToTop = window.setInterval(() => {
            const pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 40);
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 16);
    }

    join() {
        this.accessCodeLoading = true;
        this.gameSettingsService.join(this.accessId).pipe(first()).subscribe(
            n => {
                console.log('Joining');
                localStorage.setItem('sessionid', n.id);
                this.router.navigateByUrl(`game/${n.gameId}/lobby`);
            },
            error => {
                this.toastsService.toastAddDanger(error.error ? error.error.message : this.localeService.getValue('authorization.login.error'));
                this.accessId = '';
                this.accessCodeLoading = false;
                this.router.navigateByUrl('quiz-list');
                console.error(error);
            }
        );
    }

    search() {
        this.searchFilterQuizService.search(this.searchInput);
    }

    showFilter() {
        const modal = this.modalService.open(QuizFilterComponent, { size: 'sm' });
    }
}
