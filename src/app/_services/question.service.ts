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



  firstType(question: OneToFour, quizId: string, createEdit: boolean){
    const ans = this.firstTypeRightAnswers(question.answers,question.rightAnswers);
    const quizInfo = {
      id: question.id,
      title: question.title,
      quizId: quizId,
      content: question.content, 
      points: question.points,  
      typeId: "1",
      rightOptions: ans.rightAnswers,
      otherOptions: ans.answers
    };
    console.log(quizInfo);
    if(createEdit){
      return this.http.post<Question>(this.url + 'questions', JSON.stringify(quizInfo), this.httpOptions);
    }else{
      console.log("edit");
      return this.http.post<Question>(this.url + 'questions/edit', JSON.stringify(quizInfo), this.httpOptions);
    }
    
  }


  secondType(question: TrueFalse, quizId: string, createEdit: boolean){
    const quizInfo = {
      id: question.id,
      title: question.title,
      quizId: quizId,
      content: question.content, 
      points: question.points,  
      typeId: "2",
      rightOptions: [question.rightAnswer],
      otherOptions: [question.answer]
    };
    console.log(quizInfo);
    if(createEdit){
      return this.http.post<Question>(this.url + 'questions', JSON.stringify(quizInfo), this.httpOptions);
    }else{
      return this.http.post<Question>(this.url + 'questions/edit', JSON.stringify(quizInfo), this.httpOptions);
    }
  }

  thirdType(question: OpenAnswer, quizId: string, createEdit: boolean){
    const quizInfo = {
      id: question.id,
      title: question.title,
      quizId: quizId,
      content: question.content, 
      points: question.points,  
      typeId: "3",
      rightOptions: [question.rightAnswer],
      otherOptions: []
    };
    console.log(quizInfo);
    if(createEdit){
      return this.http.post<Question>(this.url + 'questions', JSON.stringify(quizInfo), this.httpOptions);
    }else{
      return this.http.post<Question>(this.url + 'questions/edit', JSON.stringify(quizInfo), this.httpOptions);
    }
  }

  fourthType(question: SequenceAnswer, quizId: string, createEdit: boolean){
    const quizInfo = {
      id: question.id,
      title: question.title,
      quizId: quizId,
      content: question.content, 
      points: question.points,  
      typeId: "4",
      rightOptions: question.rightAnswers,
      otherOptions: []
    };
    console.log(quizInfo);
    if(createEdit){
      return this.http.post<Question>(this.url + 'questions', JSON.stringify(quizInfo), this.httpOptions);
    }else{
      return this.http.post<Question>(this.url + 'questions/edit', JSON.stringify(quizInfo), this.httpOptions);
    }
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
