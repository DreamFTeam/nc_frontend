import { Injectable } from '@angular/core';
import { Observable, of, throwError} from 'rxjs';
import { ExtendedQuizPreview } from '../_models/extendedquiz-preview';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import { HandleErrorsService } from './handle-errors.service';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import {environment} from '../../environments/environment';

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
              private handleErrorsService: HandleErrorsService) {
   }

  getQuizzesByPage(pageToSend: number): Observable<ExtendedQuizPreview[]> {
    return this.http.
      get<ExtendedQuizPreview[]>(this.baseUrl + this.quizListUrl + pageToSend)
      .pipe(map(data => data.map(x => {
        return new ExtendedQuizPreview().deserialize(x, this.sanitizer);
      })), catchError(this.handleErrorsService.handleError<ExtendedQuizPreview[]>('getQuizzesByPage', []))
      );
  }

  getTotalSize(): Observable<number> {
    return this.http.get<number>(this.baseUrl + this.totalSizeUrl, this.httpOptions)
        .pipe(catchError(this.handleErrorsService.handleError<number>('getTotalSize', 0)));
  }
}
