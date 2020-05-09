import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ExtendedQuizPreview} from '../_models/extendedquiz-preview';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {SearchFilterQuizService} from './search-filter-quiz.service';

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

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
              private searchFilterQuizService: SearchFilterQuizService) {
  }

  getQuizzesByPage(pageToSend: number): Observable<ExtendedQuizPreview[]> {
    this.searchFilterQuizService.updPage(pageToSend);
    return this.searchFilterQuizService.filterQuiz();
  }

  getTotalSize(): Observable<number> {
    return this.http.get<number>(this.baseUrl + this.totalSizeUrl, this.httpOptions)
      .pipe(catchError(this.handleError<number>('getTotalSize', 0)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      return of(result as T);
    };
  }
}
