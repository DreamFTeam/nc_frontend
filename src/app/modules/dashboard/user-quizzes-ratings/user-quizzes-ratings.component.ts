import {Component, OnInit, OnDestroy} from '@angular/core';
import {ExtendedQuizRatingsPreview} from '../../core/_models/extended-quiz-ratings-preview';
import {Observable, Subscription} from 'rxjs';
import {UserQuizzesRatingsService} from '../../core/_services/user/user-quizzes-ratings.service';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';

@Component({
    selector: 'app-user-quizzes-ratings',
    templateUrl: './user-quizzes-ratings.component.html',
    styleUrls: ['./user-quizzes-ratings.component.css']
})
export class UserQuizzesRatingsComponent implements OnInit, OnDestroy {

    subscriptions: Subscription = new Subscription();

    mockImgUrl = '../../assets/img/quiz.jpg';

    quizList: ExtendedQuizRatingsPreview[];

    isEmpty: boolean;
    isLoading: boolean;
    faSpinner = faSpinner;

    constructor(private userQuizzesRatingsService: UserQuizzesRatingsService,
        private toastsService: ToastsService,
        private localeService: LocaleService) {
        this.isEmpty = false;
        this.isLoading = true;
        this.quizList = null;
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.subscriptions.add(this.userQuizzesRatingsService.getUserQuizzesRatingsList().subscribe(
            v => {
                this.quizList = v;
                if(v.length == 0){
                    this.isEmpty = true;
                }
                this.isLoading = false;
            },
            () =>
            this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
        )
        );
    }

}
