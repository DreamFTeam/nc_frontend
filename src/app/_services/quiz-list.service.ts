import { Injectable } from '@angular/core';
import { Observable, of, throwError} from 'rxjs';
import { QuizPreview } from '../_models/quiz-preview';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HandleErrorsService } from './handle-errors.service';

@Injectable({
  providedIn: 'root'
})

export class QuizListService {
  private baseUrl = 'https://qznetbc.herokuapp.com/api/quiz/';
  private quizListUrl = 'quiz-list/page/';
  private totalSizeUrl = 'getquiztotalsize';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient,
              private handleErrorsService: HandleErrorsService) { }

  getQuizzesByPage(pageToSend: number): Observable<QuizPreview[]> {
    return this.http.
      get<QuizPreview[]>(this.baseUrl + this.quizListUrl + pageToSend, this.httpOptions).pipe(
        catchError(this.handleErrorsService.handleError<QuizPreview[]>('getQuizzesByPage', []))
      );
  }

  getTotalSize(): Observable<number>{
    return this.http.get<number>(this.baseUrl + this.totalSizeUrl, this.httpOptions)
        .pipe(catchError(this.handleErrorsService.handleError<number>('getTotalSize', 0)));
  }
}
