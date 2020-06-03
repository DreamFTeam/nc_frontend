import {Component, OnInit} from '@angular/core';
import {GameSettingsService} from '../../core/_services/game/game-settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {Role} from '../../core/_models/role';
import {SearchFilterQuizService} from '../../core/_services/quiz/search-filter-quiz.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {QuizFilterComponent} from '../quiz-filter/quiz-filter.component';
import {LocaleService} from '../../core/_services/utils/locale.service';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import {first} from 'rxjs/operators';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {AnonymInitComponent} from '../../game/anonym-init/anonym-init.component';
import {AnonymService} from '../../core/_services/game/anonym.service';


const PAGE_SIZE = 16;

@Component({
    selector: 'app-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
    accessId: string;
    accessCodeLoading: boolean;
    admin: boolean;
    searchInput: string;

    canCreate: boolean;

    page: number;
    pageSize: number;
    mockImageUrl = '../../assets/img/quiz.jpg';
    isLoading: boolean;
    faSpinner = faSpinner;

    constructor(private modalService: NgbModal,
                private gameSettingsService: GameSettingsService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private authenticationService: AuthenticationService,
                public searchFilterQuizService: SearchFilterQuizService,
                private localeService: LocaleService,
                private toastsService: ToastsService,
                private anonymService: AnonymService) {
        this.pageSize = PAGE_SIZE;
        this.page = 1;
        this.isLoading = true;
    }


    ngOnInit(): void {
        this.checkGame();

        if (!this.searchFilterQuizService.getSettings().quizLang) {
            this.searchFilterQuizService.initSettings();
        }
        this.searchFilterQuizService.filterQuiz(this.page).pipe(first()).subscribe();
        this.searchInput = this.searchFilterQuizService.getSettings().quizName;

        const user = this.authenticationService.currentUserValue;

        this.canCreate = user && user.role === Role.User;

        this.admin = user && user.role !== Role.User;
    }

    private checkGame() {
        this.accessId = this.activatedRoute.snapshot.paramMap.get('accessId');
        if (this.accessId) {
            if (this.authenticationService.currentUserValue || this.anonymService.currentAnonymValue) {
                this.join();
            } else {
                const modalRef = this.modalService.open(AnonymInitComponent);
                modalRef.componentInstance.anonymName.pipe(first()).subscribe(n => {
                        this.anonymService.anonymLogin(n).pipe(first()).subscribe(() => {
                            this.join();
                        });
                    }
                );
            }
        }
    }

    loadPage(event) {
        this.searchFilterQuizService.filterQuiz(event).pipe(first()).subscribe();
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
                this.toastsService.toastAddDanger('An error occurred.');
                this.accessId = '';
                this.router.navigateByUrl('quiz-list');
                console.error(error);
            }
        );
        this.router.navigateByUrl('/join/' + this.accessId);
    }

    search() {
        this.searchFilterQuizService.search(this.searchInput);
    }

    showFilter() {
        const modal = this.modalService.open(QuizFilterComponent, {size: 'sm'});
    }
}
