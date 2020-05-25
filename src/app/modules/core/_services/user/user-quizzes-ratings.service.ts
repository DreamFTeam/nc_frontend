import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {HandleErrorsService} from '../utils/handle-errors.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {ExtendedQuizPreview} from '../../_models/extendedquiz-preview';
import {ExtendedQuizRatingsPreview} from '../../_models/extended-quiz-ratings-preview';


@Injectable({
    providedIn: 'root'
})
export class UserQuizzesRatingsService {
    private baseUrl = `${environment.apiUrl}quizzes/`;
    private httpOptions = {};


    constructor(private http: HttpClient, private sanitizer: DomSanitizer,
                private handleErrorsService: HandleErrorsService) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getUserQuizzesRatingsList(): Observable<ExtendedQuizRatingsPreview[]> {
        return this.http.get<ExtendedQuizPreview[]>(this.baseUrl + 'rating', this.httpOptions)
            .pipe(map(data => data.map(x => {
                return new ExtendedQuizRatingsPreview().deserialize(x, this.sanitizer);
            }), catchError(this.handleErrorsService.handleError<ExtendedQuizRatingsPreview[]>('getUserQuizzesRatingsList', []))));
    }

}
