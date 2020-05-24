import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {QuizValidationPreview} from '../_models/quiz-validation-preview';
import {AuthenticationService} from './authentication.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HandleErrorsService} from './handle-errors.service';
import {User} from '../_models/user';
import {environment} from '../../../../environments/environment';

export enum ListType {
  Unvalidated = 1,
  Validated = 2
}

@Injectable({
  providedIn: 'root'
})
export class QuizValidationListService {
  private _listType: ListType;
  private baseUrl = `${environment.apiUrl}quizzes/`;
  // private baseUrl = 'http://localhost:8081/api/quizzes/';
  private unvalSizeUrl = 'invalidquiztotalsize';
  private validSizeUrl = 'validquiztotalsize';
  private quizUnvalListUrl = 'quiz-list-invalid/page/';
  private quizValidListUrl = 'quiz-list-valid/page/';
  private info: User;
  private httpOptions = {};

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
              private handleErrorsService: HandleErrorsService,
              private authenticationService: AuthenticationService) {
    this._listType = ListType.Unvalidated;
    this.info = authenticationService.currentUserValue;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getCurrentUsername(): string {
    return this.info.username;
  }

  getQuizListByPage(pageToSend: number): Observable<QuizValidationPreview[]> {
    switch (this._listType) {
      case ListType.Unvalidated: {
        return this.sendGetQuizListByPage(this.quizUnvalListUrl, pageToSend, 'getUnvalidatedQuizzesByPage');
      }
      case ListType.Validated: {
        return this.sendGetQuizListByPage(this.quizValidListUrl, pageToSend, 'getValidatedQuizzesByPage');
      }
    }
  }

  sendGetQuizListByPage(url, page, methodCaption): Observable<QuizValidationPreview[]> {
    return this.http.get<QuizValidationPreview[]>(this.baseUrl + url + page, this.httpOptions)
      .pipe(
        map(data => data.map(x => {
          return new QuizValidationPreview().deserialize(x, this.sanitizer);
        })),
        catchError(this.handleErrorsService.handleError<QuizValidationPreview[]>(methodCaption, [])));
  }

  getTotalSize(): Observable<number> {
    switch (this._listType) {
      case ListType.Unvalidated: {
        return this.sendGetTotalSize(this.unvalSizeUrl, 'getUnvalidatedTotalSize');
      }
      case ListType.Validated: {
        return this.sendGetTotalSize(this.validSizeUrl, 'getValidatedTotalSize');
      }
    }

  }

  sendGetTotalSize(url, methodCaption): Observable<number> {
    return this.http.get<number>(this.baseUrl + url, this.httpOptions)
      .pipe(catchError(this.handleErrorsService.handleError<number>(methodCaption, 0)));
  }

  public set listType(value: ListType) {
    this._listType = value;
  }
}
