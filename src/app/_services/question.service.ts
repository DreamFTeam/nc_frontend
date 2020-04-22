import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../_models/user';
import { OneToFour } from '../_models/question/onetofour';
import { Question } from '../_models/question/question';
import { TrueFalse } from '../_models/question/truefalse';
import { OpenAnswer } from '../_models/question/openanswer';
import { SequenceAnswer } from '../_models/question/sequenceanswer';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  url = `http://localhost:8081/api/quiz/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userToken')));
    this.currentUser = this.currentUserSubject.asObservable();
    
  }

  public currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  firstType(question: OneToFour, quizId: string){
    const ans = this.firstTypeRightAnswers(question.answers,question.rightAnswers);
    const quizInfo = {
      title: question.title,
      quizId: quizId,
      content: question.content, 
      points: question.points,  
      typeId: "1",
      rightOptions: ans.rightAnswers,
      otherOptions: ans.answers
    };
    console.log(quizInfo);
    return this.http.post<Question>(this.url + 'create/question', JSON.stringify(quizInfo), this.httpOptions);
  }


  secondType(question: TrueFalse, quizId: string){
    const quizInfo = {
      title: question.title,
      quizId: quizId,
      content: question.content, 
      points: question.points,  
      typeId: "2",
      rightOptions: [question.rightAnswer],
      otherOptions: [question.answer]
    };
    console.log(quizInfo);
    return this.http.post<Question>(this.url + 'create/question', JSON.stringify(quizInfo), this.httpOptions);
  }

  thirdType(question: OpenAnswer, quizId: string){
    const quizInfo = {
      title: question.title,
      quizId: quizId,
      content: question.content, 
      points: question.points,  
      typeId: "3",
      rightOptions: [question.rightAnswer],
      otherOptions: []
    };
    console.log(quizInfo);
    return this.http.post<Question>(this.url + 'create/question', JSON.stringify(quizInfo), this.httpOptions);
  }

  fourthType(question: SequenceAnswer, quizId: string){
    const quizInfo = {
      title: question.title,
      quizId: quizId,
      content: question.content, 
      points: question.points,  
      typeId: "4",
      rightOptions: question.rightAnswers,
      otherOptions: []
    };
    console.log(quizInfo);
    return this.http.post<Question>(this.url + 'create/question', JSON.stringify(quizInfo), this.httpOptions);
  }



  firstTypeRightAnswers(answers: string[], rAnswers: boolean[]){
    let rightAnswers: string[] = [];
    let answ : string[] = [];
    for (let i = 0; i < answers.length; i++) {
      if(rAnswers[i]){
        rightAnswers.push(answers[i]);
      }else{
        answ.push(answers[i]);
      }
    }

    return {answers: answ, rightAnswers: rightAnswers};
  }

  
}
