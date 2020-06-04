import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {QuizValidationPreview} from 'src/app/modules/core/_models/quiz-validation-preview';
import {QuizValidationListService} from 'src/app/modules/core/_services/quiz/quiz-validation-list.service';
import {Router} from '@angular/router';
import {QuizValidationService} from 'src/app/modules/core/_services/quiz/quiz-validation.service';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {ToastsService} from 'src/app/modules/core/_services/utils/toasts.service';
import {ModalService} from 'src/app/modules/core/_services/utils/modal.service';
import {LocaleService} from 'src/app/modules/core/_services/utils/locale.service';
import { DateService } from '../../core/_services/utils/date.service';


@Component({
    selector: 'app-validation-tab',
    templateUrl: './validation-tab.component.html',
    styleUrls: ['./validation-tab.component.css']
})
export class ValidationTabComponent implements OnInit, OnDestroy {
    subscriptions: Subscription = new Subscription();
    //Pagination: number of items per page
    pageSize: number = 6;

    //src of mock image
    mockImageUrl: string = '../../assets/img/quiz.jpg';
    //Async - total size of quiz list. Used for pagination.
    totalSize$: Observable<number>;
    quizList$: Observable<QuizValidationPreview[]>;
    page: number;
    @Input() showButtons: boolean;
    faSpinner = faSpinner;
    isLoading: boolean;
    //Used to show message about empty list
    //Must use it because using length in condition doesn't work properly
    isEmpty: boolean;

    toasts: any[];

    constructor(private quizValidationListService: QuizValidationListService,
                private quizValidationService: QuizValidationService,
                private router: Router,
                private modalService: ModalService,
                public toastsService: ToastsService,
                private localeService: LocaleService,
                public dateService: DateService) {
        this.isLoading = true;
        this.isEmpty = false;
        this.toasts = [];
    }

    ngOnInit(): void {
        this.page = 1;
        this.getTotalSize();
        this.getQuizList(this.page);
    }

    ngOnDestroy(): void{
        this.subscriptions.unsubscribe();
    }

    getTotalSize(): void {
        this.totalSize$ = this.quizValidationListService.getTotalSize();
        this.subscriptions.add(this.totalSize$.subscribe(val => {
                this.isLoading = false;
            },
            error => {
                this.toastsService.toastAddDanger('Couldn\'t fetch list size.');
            }));
    }

    getQuizList(page): void {
        this.quizList$ = this.quizValidationListService.getQuizListByPage(page);
        this.subscriptions.add(this.quizList$.subscribe(val => {
            if (val.length == 0) {
                this.isEmpty = true;
            }
        }, error => {
            this.toastsService.toastAddDanger('An error occured while fetching the list of quizzes.');
        }));
    }

    loadPage(event): void {
        this.getQuizList(event);
    }

    validate(id: string): void {
        this.router.navigateByUrl('/validation/' + id);
    }

    reject(id: string, creatorId: string, title: string): void {
        this.subscriptions.add(this.modalService.openModal(this.localeService.getValue('modal.reject'), 'warning')
            .subscribe((receivedEntry) => {
                if (receivedEntry) {
                    this.quizValidationService.validateQuiz(id, false, 'This quiz was instantly rejected without validation', creatorId, title)
                        .subscribe(next => {
                                this.toastsService.toastAddSuccess(this.localeService.getValue('toasterEditor.rejected'));
                                this.page = 1;
                                this.getTotalSize();
                                this.getQuizList(this.page);
                            },
                            error => {
                                this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
                            });
                }
            }));
    }
}
