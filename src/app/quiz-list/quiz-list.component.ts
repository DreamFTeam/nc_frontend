import { Component, OnInit } from '@angular/core';
import { ExtendedQuizPreview } from '../_models/extendedquiz-preview';
import { GameSettingsService } from '../_services/game-settings.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/role';
import { SearchFilterQuizService } from '../_services/search-filter-quiz.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizFilterComponent } from '../quiz-filter/quiz-filter.component';


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
        private searchFilterQuizService: SearchFilterQuizService) {
        this.pageSize = PAGE_SIZE;
        this.page = 1;
    }

    ngOnInit(): void {
        this.searchFilterQuizService.filterQuiz(this.page).subscribe();
        this.searchFilterQuizService.currentQuizzes.subscribe(quizzes => {
            if (quizzes) {
                this.quizList = quizzes;
            }
        });
        this.searchInput = this.searchFilterQuizService.getSettings().quizName;
        this.searchFilterQuizService.currentQuizzesSize.subscribe(size =>
            this.totalSize = size);
        this.canCreate = this.authenticationService.currentUserValue != null;
        this.admin = this.authenticationService.currentUserValue
            && this.authenticationService.currentUserValue.role !== Role.User;
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
        this.router.navigateByUrl('/join/' + this.accessCode);
    }

    search() {
        this.searchFilterQuizService.search(this.searchInput);
    }

    showFilter() {
        const modal = this.modalService.open(QuizFilterComponent, { size: 'sm' });
    }
}
