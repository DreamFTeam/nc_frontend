import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from './authentication.service';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { Quiz } from '../_models/quiz';
import { HandleErrorsService } from './handle-errors.service';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { map, catchError } from 'rxjs/operators';
import { ExtendedQuestion } from '../_models/question/extendedquestion';

@Injectable({
  providedIn: 'root'
})
export class QuizValidationService {
  private baseUrl = 'https://qznetbc.herokuapp.com/api/quiz/';
  private setValidatorUrl = 'setvalidator';
  private validateUrl = "validate";
  private questionsUrl = "getquestionlist/page/";
  //private unvalSizeUrl = 'getinvalidquiztotalsize';
  //private validSizeUrl = 'getvalidquiztotalsize';
  //private quizUnvalListUrl = 'quiz-list-invalid/page/';
  //private quizValidListUrl = 'quiz-list-valid/page/';
 
  private info: any;
  private httpOptions = {};

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
              private handleErrorsService: HandleErrorsService) {
    this.info = JSON.parse(localStorage.getItem('userData'));
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.info.token
      })
    };
  }

  validateQuiz(id: string, toValidate: boolean, admComment: string){
    return this.http.post(this.baseUrl + this.validateUrl, {quiz_id: id, validated: toValidate, adminCommentary: admComment}, this.httpOptions);
  }

  getQuizToValidate(id: string): Observable<ExtendedQuiz>{
    return this.http.post<ExtendedQuiz>(this.baseUrl + this.setValidatorUrl, {quiz_id: id}, this.httpOptions)
    .pipe(map(data => {
      return new ExtendedQuiz().deserialize(data, this.sanitizer);
    }),
    catchError(this.handleErrorsService.handleError<ExtendedQuiz>("getQuizToValidate", new ExtendedQuiz())));

  }

  getQuestionListByPage(quiz_id: string, page: number): Observable<ExtendedQuestion[]>{
    return of([]);
    /*
    return this.http.get<ExtendedQuestion[]>(this.baseUrl + this.questionsUrl + page, this.httpOptions)
      .pipe(map(data => data.map(x => {
        return new ExtendedQuestion().deserialize(x, this.sanitizer);
      }),
      catchError(this.handleErrorsService.handleError<ExtendedQuestion[]>("getQuestionList", []))));
  */
  }
  
  getTotalQuestionsListSize(quiz_id: string): Observable<number>{
    return of(12);
    //TODO - add url when back is ready  
    //return this.http.get<number>(this.baseUrl + this.)
  } 
}
