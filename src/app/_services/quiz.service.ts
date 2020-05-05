import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Quiz } from '../_models/quiz';
import { User } from '../_models/user';
import * as jwt_decode from 'jwt-decode';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
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

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    let info = JSON.parse(localStorage.getItem('userData'));
    this.user = jwt_decode(info.token)
    this.user.token = info.token;
  }


  saveQuiz(quiz: Quiz) : Observable<Quiz>{


    const quizInfo = {
      title: quiz.title,
      quizId: quiz.id,
      creatorId: this.user.id,
      newTitle: quiz.title,
      newLanguage: quiz.quizLanguage,
      newDescription: quiz.description,
      newImageRef: quiz.imageReference,
      newTagList: quiz.tags,
      newCategoryList: quiz.category
    };

    console.log(quizInfo);
    return this.http.post<Quiz>(this.url + 'edit', JSON.stringify(quizInfo), this.httpOptions)
  }
  

  createQuiz(quiz: Quiz) : Observable<Quiz> {
    const quizInfo = {
      title: quiz.title,
      creatorId: this.user.id,
      language: quiz.quizLanguage,
      description: quiz.description,
      //imageRef: quiz.imageReference,
      tagList: quiz.tags,
      categoryList: quiz.category
    };
    console.log(quizInfo);

    return this.http.post<Quiz>(this.url, JSON.stringify(quizInfo), this.httpOptions)
  }

  getQuizNew(quizId: string): Observable<ExtendedQuiz>{
    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('quizId', quizId)

    }

    return this.http.get<ExtendedQuiz>(this.url, options)
    .pipe(map(data => {
      return new ExtendedQuiz().deserialize(data, this.sanitizer);
    }));
  }

  getQuiz(quizId: string) : Observable<Quiz> {

    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('quizId', quizId)

    }
    return this.http.get<Quiz>(this.url, options);
  }


  markAsFavorite(id: string){
    const favoriteInfo = {
      quizId: id,
      userId: this.user.id,
    };
    
    return this.http.post<Quiz>(this.url + 'markasfavourite', JSON.stringify(favoriteInfo), this.httpOptions);
  }


  publishQuiz(id: string){
    const quizInfo = {
      quizId: id
    };

    return this.http.post<Quiz>(this.url + 'markaspublished', JSON.stringify(quizInfo), this.httpOptions)
  }

  canIEditQuiz(id: string){
    return id === this.user.id;
  }


  uploadImage(data : FormData) {
    console.log(data)
    return this.http.post<Quiz>(this.url+"quiz-image", data, this.httpOptions2);
  }

}
