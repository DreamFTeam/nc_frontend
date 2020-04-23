import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Quiz } from '../_models/quiz';
import { User } from '../_models/user';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  url = `https://qznetbc.herokuapp.com/api/quiz/`;
  httpOptions = {};
  user: User;

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.user.token
      })
    };
  }


  saveQuiz(quiz: Quiz) : Observable<Quiz>{


    const quizInfo = {
      title: quiz.title,
      quizId: quiz.id,
      creatorId: jwt_decode(this.user.token).id,
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
      creatorId: jwt_decode(this.user.token).id,
      language: quiz.quizLanguage,
      description: quiz.description,
      imageRef: quiz.imageReference,
      tagList: quiz.tags,
      categoryList: quiz.category
    };

    return this.http.post<Quiz>(this.url + 'create', JSON.stringify(quizInfo), this.httpOptions)
  }

  getQuiz(quizId: string) : Observable<Quiz> {

    let params = new HttpParams().set('quizId', quizId).set('userId', jwt_decode(this.user.token).id);

    return this.http.get<Quiz>(this.url + 'get', {params: params});
  }


  markAsFavorite(id: string){
    const favoriteInfo = {
      quizId: id,
      userId: jwt_decode(this.user.token).id,
    };
    return this.http.post<Quiz>(this.url + 'markasfavourite', JSON.stringify(favoriteInfo), this.httpOptions);
  }


  publishQuiz(id: string){
    const quizInfo = {
      quizId: id
    };

    return this.http.post<Quiz>(this.url + 'markaspublished', JSON.stringify(quizInfo), this.httpOptions)
  }

  

}
