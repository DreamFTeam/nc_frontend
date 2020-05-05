import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { User } from '../_models/user';
import { OneToFour } from '../_models/question/onetofour';
import { Question } from '../_models/question/question';
import { TrueFalse } from '../_models/question/truefalse';
import { OpenAnswer } from '../_models/question/openanswer';
import { SequenceAnswer } from '../_models/question/sequenceanswer';
import { ExtendedQuestion } from '../_models/question/extendedquestion';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  url = `https://qznetbc.herokuapp.com/api/quizzes/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).token
    })
  };
  httpOptions2 = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).token
    })
  };
  user: User;

  constructor(private http: HttpClient , private sanitizer: DomSanitizer) {
    this.user = JSON.parse(localStorage.getItem('userData'));
    
  }

  //REFACTORED

  getAllQuestionsNew(quizId: string): Observable<ExtendedQuestion[]>{
    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('quizId', quizId)

    }
    
    return this.http.get<ExtendedQuestion[]>(this.url + 'questions', options)
      .pipe(map(data => data.map(x => {
        return new ExtendedQuestion().deserialize(x, this.sanitizer);
      })));
  }



  //END OF REFACTORED
  


  getAllQuestions(quizId: string){

    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('quizId', quizId)

    }

    return this.http.get<Question[]>(this.url + 'questions', options);
  }

  sendQuestion(question: ExtendedQuestion, createEdit: boolean) {

    var questionInfo = Object.assign({}, question);
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



  deleteQuestion(id: string){
    const options = {
      headers: this.httpOptions.headers,
      body: {
        id: id
      },
    };
    
      return this.http.delete<Question>(this.url + 'questions',options);
  }

  uploadImage(data : FormData) {

    return this.http.post<Question>(this.url+"question-image", data, this.httpOptions2);
  }

  
}
