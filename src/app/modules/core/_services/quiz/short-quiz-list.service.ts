import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {HandleErrorsService} from '../utils/handle-errors.service';
import {ExtendedQuiz} from '../../_models/extended-quiz';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {ExtendedQuizPreview} from '../../_models/extendedquiz-preview';

@Injectable({
    providedIn: 'root'
})
export class ShortQuizListService {

    private baseUrl = `${environment.apiUrl}quizzes/`;
    private shortListUrl = 'short-list';

    private httpOptions = {};

    constructor(private http: HttpClient, private sanitizer: DomSanitizer,
                private handleErrorsService: HandleErrorsService) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getShortQuizList(): Observable<ExtendedQuizPreview[]> {
        console.log(this.baseUrl + this.shortListUrl);
        return this.http.get<ExtendedQuizPreview[]>(this.baseUrl + this.shortListUrl, this.httpOptions)
            .pipe(map(data => data.map(x => {
                return new ExtendedQuizPreview().deserialize(x, this.sanitizer);
            }), catchError(this.handleErrorsService.handleError<ExtendedQuiz[]>('getShortQuizList', []))));
    }

}
