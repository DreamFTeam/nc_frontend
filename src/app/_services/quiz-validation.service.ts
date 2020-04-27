import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from './authentication.service';
import { User } from '../_models/user';
import { Observable } from 'rxjs';
import { Quiz } from '../_models/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizValidationService {
  private baseUrl = 'https://qznetbc.herokuapp.com/api/quiz/';
  private setValidatorUrl = 'setvalidator';
  //private unvalSizeUrl = 'getinvalidquiztotalsize';
  //private validSizeUrl = 'getvalidquiztotalsize';
  //private quizUnvalListUrl = 'quiz-list-invalid/page/';
  //private quizValidListUrl = 'quiz-list-valid/page/';
 
  private httpOptions = {};
  private user : User;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private authService: AuthenticationService) {
    this.user = this.authService.currentUserValue;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.user.token
      })
    };
  }


  getQuizToValidate(id: string): Observable<Quiz>{
    return this.http.post<Quiz>(this.baseUrl + this.setValidatorUrl, {quizId: id}, this.httpOptions)
      .pipe();
  }

}
