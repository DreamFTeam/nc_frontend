import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../_models/user';
import {Question} from '../_models/question/question';
import {ExtendedQuestion} from '../_models/question/extendedquestion';
import {DomSanitizer} from '@angular/platform-browser';
import {map} from 'rxjs/operators';
import {Alert} from '../_models/alert';
import {environment} from '../../environments/environment';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  url = `${environment.apiUrl}quizzes/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  user: User;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
              private authenticationService: AuthenticationService) {
    this.user = authenticationService.currentUserValue;

  }

  // REFACTORED

  getAllQuestionsNew(quizId: string): Observable<ExtendedQuestion[]> {
    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('quizId', quizId)

    };

    return this.http.get<ExtendedQuestion[]>(this.url + 'questions', options)
      .pipe(map(data => data.map(x => {
        return new ExtendedQuestion().deserialize(x, this.sanitizer);
      })));
  }


  // END OF REFACTORED


  getAllQuestions(quizId: string) {

    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('quizId', quizId)

    };

    return this.http.get<Question[]>(this.url + 'questions', options);
  }

  sendQuestion(question: ExtendedQuestion, createEdit: boolean) {

    const questionInfo = Object.assign({}, question);
    delete questionInfo.imageContent;

    if (question.typeId === 3 || question.typeId === 4) {
      questionInfo.otherOptions = [];
    }

    console.log(questionInfo);

    if (createEdit) {
      return this.http.post<ExtendedQuestion>(this.url + 'questions', JSON.stringify(questionInfo), this.httpOptions)
        .pipe(map(data => {
          return new ExtendedQuestion().deserialize(data, this.sanitizer);
        }));
    } else {
      return this.http.post<ExtendedQuestion>(this.url + 'questions/edit', JSON.stringify(questionInfo), this.httpOptions)
        .pipe(map(data => {
          return new ExtendedQuestion().deserialize(data, this.sanitizer);
        }));
    }
  }


  deleteQuestion(id: string) {
    const options = {
      headers: this.httpOptions.headers,
      body: {
        id
      },
    };

    return this.http.delete<Question>(this.url + 'questions', options);
  }

  uploadImage(data: FormData) {
    return this.http.post<Question>(this.url + 'question-image', data);
  }

  questionValidator(question: ExtendedQuestion): Alert {

    if (question.title === '') {
      return {type: 'warning', message: 'No title provided'};
    }

    if (question.content === '') {
      return {type: 'warning', message: 'No content provided'};
    }

    if (question.rightOptions.includes('') || question.otherOptions.includes('')) {
      return {type: 'warning', message: 'One of answers is empty'};
    }

    if (!(question.points > 0)) {
      return {type: 'warning', message: 'Points are < 0 or has text value'};
    }


    return undefined;
  }

  questionsTotalSize(quizId: string): Observable<number> {
    return this.http.get<number>(this.url + quizId + '/questions/amount');
  }

}
