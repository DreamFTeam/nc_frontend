import {Component, OnInit} from '@angular/core';
import {ShortQuizListService} from '../../core/_services/quiz/short-quiz-list.service';
import {Observable} from 'rxjs';
import {ExtendedQuizPreview} from '../../core/_models/extendedquiz-preview';

@Component({
    selector: 'app-short-quiz-list',
    templateUrl: './short-quiz-list.component.html',
    styleUrls: ['./short-quiz-list.component.css']
})
export class ShortQuizListComponent implements OnInit {

    shortQuizList$: Observable<ExtendedQuizPreview[]>;
    mockImgUrl = '../../assets/img/quiz.jpg';

    constructor(private shortQuizListService: ShortQuizListService) {
    }

    ngOnInit(): void {
        this.getShortQuizList();
    }

    getShortQuizList(): void {
        this.shortQuizList$ = this.shortQuizListService.getShortQuizList();
    }


}
