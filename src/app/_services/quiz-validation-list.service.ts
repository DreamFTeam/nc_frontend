import { Injectable } from '@angular/core';
import { Observable, of, throwError} from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { QuizValidationPreview } from '../_models/quiz-validation-preview';
import { AuthenticationService } from './authentication.service';
import { DomSanitizer } from '@angular/platform-browser';

export enum ListType {
  Unvalidated = 1,
  Validated = 2
}

@Injectable({
  providedIn: 'root'
})
export class QuizValidationListService {
  private _listType: ListType;
  //private baseUrl = 'https://qznetbc.herokuapp.com/api/quiz/';
  private baseUrl = 'http://localhost:8081/api/quiz/';
  private unvalSizeUrl = 'getinvalidquiztotalsize/';
  private validSizeUrl = 'getvalidquiztotalsize/';
  private quizUnvalListUrl = 'quiz-list-invalid/page/';
  private quizValidListUrl = 'quiz-list-valid/page/';
  private info: any;
  private httpOptions = {};

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this._listType = ListType.Unvalidated; 
    this.info = JSON.parse(localStorage.getItem('userData'));
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.info.token
      })
    };
  }

  getCurrentUsername(): string{
    return this.info.username;
  }

  getQuizListByPage(pageToSend: number): Observable<QuizValidationPreview[]>{
    //return of([]);
    switch(this._listType){
      case ListType.Unvalidated: {
            return this.sendGetQuizListByPage(this.quizUnvalListUrl, pageToSend, 'getUnvalidatedQuizzesByPage');
        break;
      }
      case ListType.Validated: {
            return this.sendGetQuizListByPage(this.quizValidListUrl, pageToSend, 'getValidatedQuizzesByPage');
        break;
      }
    }   
  }

  sendGetQuizListByPage(url, page, methodCaption): Observable<QuizValidationPreview[]>{
    return this.http.get<QuizValidationPreview[]>(this.baseUrl + url + page, this.httpOptions)
        .pipe(
          map(data => data.map(x => {
                return new QuizValidationPreview().deserialize(x, this.sanitizer);
              })), 
          catchError(this.handleError<QuizValidationPreview[]>(methodCaption, [])));
  }

  getTotalSize(): Observable<number>{
    //console.log("Get total size... Current listType: ");
    //console.log(ListType[this._listType]);
    //return of(32);
    switch(this._listType){
      case ListType.Unvalidated: {
            return this.sendGetTotalSize(this.unvalSizeUrl, 'getUnvalidatedTotalSize');
        break;
      }
      case ListType.Validated: {
            return this.sendGetTotalSize(this.validSizeUrl, 'getValidatedTotalSize');
        break;
      }
    }
    
  }

  sendGetTotalSize(url, methodCaption): Observable<number>{
    return this.http.get<number>(this.baseUrl + url, this.httpOptions)
    .pipe(catchError(this.handleError<number>(methodCaption, 0)));
  }

  public set listType(value: ListType){
    this._listType = value;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      return of(result as T);
    };
  }
}
