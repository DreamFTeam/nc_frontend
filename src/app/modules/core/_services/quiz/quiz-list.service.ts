import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../../../environments/environment';
import {SearchFilterQuizService} from './search-filter-quiz.service';
import {HandleErrorsService} from '../utils/handle-errors.service';

@Injectable({
    providedIn: 'root'
})

export class QuizListService {
    private baseUrl = `${environment.apiUrl}quizzes/`;
    private quizListUrl = 'quiz-list/page/';
    private totalSizeUrl = 'totalsize';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient,
                private sanitizer: DomSanitizer,
                private searchFilterQuizService: SearchFilterQuizService,
                private handleErrorsService: HandleErrorsService) {
    }

    // getQuizzesByPage(pageToSend: number): Observable<ExtendedQuizPreview[]> {
    //   // this.searchFilterQuizService.updPage(pageToSend);
    //   // return this.searchFilterQuizService.filterQuiz();
    // }
    //
    // getTotalSize(): Observable<number> {
    //   return this.http.get<number>(this.baseUrl + this.totalSizeUrl, this.httpOptions)
    //     .pipe(catchError(this.handleErrorsService.handleError<number>('getTotalSize', 0)));
    // }
}
