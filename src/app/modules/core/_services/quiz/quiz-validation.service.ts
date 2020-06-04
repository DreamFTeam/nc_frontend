import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {HandleErrorsService} from '../utils/handle-errors.service';
import {ExtendedQuiz} from '../../_models/extended-quiz';
import {catchError, map} from 'rxjs/operators';
import {ExtendedQuestion} from '../../_models/question/extendedquestion';
import {AuthenticationService} from '../authentication/authentication.service';
import {User} from '../../_models/user';
import {environment} from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuizValidationService {
    private baseUrl = `${environment.apiUrl}quizzes/`;
    private setValidatorUrl = 'setvalidator';
    private validateUrl = 'validate';
    private questionsTotalSizeUrl = '/questions/amount';//quiz_id before it
    private questionsByPageUrl = '/questions/page/';//quiz_id before it

    private info: User;
    private httpOptions = {};

    constructor(private http: HttpClient, private sanitizer: DomSanitizer,
                private handleErrorsService: HandleErrorsService,
                private authenticationService: AuthenticationService) {
        this.info = authenticationService.currentUserValue;
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    validateQuiz(id: string, toValidate: boolean, admComment: string, authorId: string, quizTitle: string) {
        return this.http.patch(this.baseUrl + this.validateUrl, {
            quizId: id,
            validated: toValidate,
            adminCommentary: admComment,
            creatorId: authorId, //creatorId and title are used here for better activities adding performance
            title: quizTitle
        }, this.httpOptions);
    }

    getQuizToValidate(id: string): Observable<ExtendedQuiz> {
        return this.http.patch<ExtendedQuiz>(this.baseUrl + this.setValidatorUrl, {quizId: id}, this.httpOptions)
            .pipe(map(data => {
                    return new ExtendedQuiz().deserialize(data, this.sanitizer);
                }),
                catchError(this.handleErrorsService.handleError<ExtendedQuiz>('getQuizToValidate', new ExtendedQuiz())));
    }

    getQuestionListByPage(quiz_id: string, page: number): Observable<ExtendedQuestion[]> {
        return this.http.get<ExtendedQuestion[]>(this.baseUrl + quiz_id + this.questionsByPageUrl + page, this.httpOptions)
            .pipe(map(data => data.map(x => {
                    return new ExtendedQuestion().deserialize(x, this.sanitizer);
                }),
                catchError(this.handleErrorsService.handleError<ExtendedQuestion[]>('getQuestionList', []))));
    }

    getTotalQuestionsListSize(quiz_id: string): Observable<number> {
        return this.http.get<number>(this.baseUrl + quiz_id + this.questionsTotalSizeUrl, this.httpOptions)
            .pipe(catchError(this.handleErrorsService.handleError<number>('getTotalQuestionsListSize', 0)));
    }
}
