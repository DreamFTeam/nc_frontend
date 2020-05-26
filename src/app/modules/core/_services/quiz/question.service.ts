import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../../_models/user';
import {Question} from '../../_models/question/question';
import {ExtendedQuestion} from '../../_models/question/extendedquestion';
import {DomSanitizer} from '@angular/platform-browser';
import {map, catchError} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {AuthenticationService} from '../authentication/authentication.service';
import { HandleErrorsService } from '../utils/handle-errors.service';
import { LocaleService } from '../utils/locale.service';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    url = `${environment.apiUrl}quizzes/`;

    user: User;

    constructor(private http: HttpClient, private sanitizer: DomSanitizer,
                private authenticationService: AuthenticationService,
                private handleErrorsService : HandleErrorsService,
                private localeService: LocaleService) {
        this.user = authenticationService.currentUserValue;

    }

    getAllQuestionsNew(quizId: string): Observable<ExtendedQuestion[]> {
        const options = {
            params: new HttpParams().set('quizId', quizId)

        };

        return this.http.get<ExtendedQuestion[]>(this.url + 'questions', options)
            .pipe(map(data => data.map(x => {
                return new ExtendedQuestion().deserialize(x, this.sanitizer);
            }),
            catchError(this.handleErrorsService.handleError<ExtendedQuestion[]>('getAllQuestionsNew', []))));
    }

    //OLD VERSION
    getAllQuestions(quizId: string): Observable<Question[]> {

        const options = {
            params: new HttpParams().set('quizId', quizId)

        };

        return this.http.get<Question[]>(this.url + 'questions', options).pipe(
            catchError(this.handleErrorsService.handleError<Question[]>('getAllQuestions', []))
        );
    }

    sendQuestion(question: ExtendedQuestion, createEdit: boolean): Observable<ExtendedQuestion> {
        const questionInfo = Object.assign({}, question);
        delete questionInfo.imageContent;

        if (question.typeId === 3 || question.typeId === 4) {
            questionInfo.otherOptions = [];
        }

        const formData = new FormData();
        formData.append('obj', JSON.stringify(questionInfo));
        if (questionInfo.unsanitizedImage !== undefined && questionInfo.unsanitizedImage !== null) {
            formData.append('img', questionInfo.unsanitizedImage, questionInfo.unsanitizedImage.name);
        }


        if (createEdit) {
            return this.http.post<ExtendedQuestion>(this.url + 'questions', formData)
                .pipe(map(data => {
                    return new ExtendedQuestion().deserialize(data, this.sanitizer);
                }),
                catchError(this.handleErrorsService.handleError<ExtendedQuestion>('saveQuestion', new ExtendedQuestion())));
        } else {
            return this.http.post<ExtendedQuestion>(this.url + 'questions/edit', formData)
                .pipe(map(data => {
                    return new ExtendedQuestion().deserialize(data, this.sanitizer);
                }),
                catchError(this.handleErrorsService.handleError<ExtendedQuestion>('editQuestion', new ExtendedQuestion())));
        }
    }


    deleteQuestion(id: string) {
        const options = {
            headers: new HttpHeaders(),
            body: {
                id
            },
        };

        return this.http.delete<Question>(this.url + 'questions', options).pipe(
            catchError(this.handleErrorsService.handleError<any>('deleteQuestion'))
        );
    }

    questionsTotalSize(quizId: string): Observable<number> {
        return this.http.get<number>(this.url + quizId + '/questions/amount').pipe(
            catchError(this.handleErrorsService.handleError<number>('questionsTotalSize'))
        );
    }

    questionValidator(question: ExtendedQuestion): string[] {
        let res: string[] = [];


        if (question.title.trim().length < 2) {
            res.push(this.localeService.getValue('validator.questionTitle'));
        }

        if (question.content.trim().length < 2) {
            res.push(this.localeService.getValue('validator.questionContent'));
        }

        if (question.rightOptions.includes('') || (question.typeId === 1 && question.otherOptions.includes(''))) {
            res.push(this.localeService.getValue('validator.emptyAnswer'));
        }

        if (!(question.points > 0)) {
            res.push(this.localeService.getValue('validator.points'));
        }


        return res;
    }

}
