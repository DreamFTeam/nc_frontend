import {Component, OnInit, OnDestroy} from '@angular/core';
import {ShortQuizListService} from '../../core/_services/quiz/short-quiz-list.service';
import {Observable, Subscription} from 'rxjs';
import {ExtendedQuizPreview} from '../../core/_models/extendedquiz-preview';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-short-quiz-list',
    templateUrl: './short-quiz-list.component.html',
    styleUrls: ['./short-quiz-list.component.css']
})
export class ShortQuizListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription = new Subscription();
    
    shortQuizList: ExtendedQuizPreview[];
    mockImgUrl = '../../assets/img/quiz.jpg';
    faSpinner = faSpinner;
    isEmpty: boolean;
    isLoading: boolean;

    constructor(private shortQuizListService: ShortQuizListService) {
        this.isEmpty = false;
        this.isLoading = true;
    }

    ngOnInit(): void {
        this.getShortQuizList();
    }

    getShortQuizList(): void {
        this.subscriptions.add(this.shortQuizListService.getShortQuizList().subscribe(
            v => {
                this.shortQuizList = v;
                if (v.length == 0){
                    this.isEmpty = true;
                }
                this.isLoading = false;
            }
        ));
    }

    ngOnDestroy(): void{
        this.subscriptions.unsubscribe();        
    }


}
