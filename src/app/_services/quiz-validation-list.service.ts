import { Injectable } from '@angular/core';
import { Observable, of, throwError} from 'rxjs';
import { QuizPreview } from '../_models/quiz-preview';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { QuizValidationPreview } from '../_models/quiz-validation-preview';
import { AuthenticationService } from './authentication.service';

export enum ListType {
  Unvalidated = 1,
  Validated = 2
}

@Injectable({
  providedIn: 'root'
})
export class QuizValidationListService {
  
  private _listType: ListType;
  
  private baseUrl = 'https://qznetbc.herokuapp.com/api/quiz/';
  private unvalSizeUrl = 'getinvalidquiztotalsize/';
  private validSizeUrl = 'getvalidquiztotalsize/';
  //private quizUnvListUrl = 'quiz-list-invalid/';
  //private totalSizeUrl = 'getquiztotalsize/';
  httpOptions = {};

  constructor(private http: HttpClient) {
    this._listType = ListType.Unvalidated; 
    let info = JSON.parse(localStorage.getItem('userData'));
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + info.token
      })
    };
  }

  getQuizListByPage(pageToSend: number): Observable<QuizValidationPreview[]>{
    return of([]);
    switch(this._listType){
      case ListType.Unvalidated: {
        break;
      }
      case ListType.Validated: {
        break;
      }
    }
    //    return this.http.get<QuizValidationPreview[]>(this.baseUrl + this.quizUnvListUrl + pageToSend, this.httpOptions)
//    .pipe(catchError(this.handleError<QuizValidationPreview[]>('getUnvalidatedQuizzesByPage', [])));
  }

  getTotalSize(): Observable<number>{
    // return this.http.get<number>(this.baseUrl + this.totalUnvalidatedSizeUrl, this.httpOptions)
    //     .pipe(catchError(this.handleError<number>('getTotalUnvalidatedSize', 0)));
    console.log("Get total size... Current listType: ");
    console.log(ListType[this._listType]);
    return of(32);
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
