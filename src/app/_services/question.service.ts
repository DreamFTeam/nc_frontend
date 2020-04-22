import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Quiz } from '../_models/quiz';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  usersUrl = `https://qznetbc.herokuapp.com/api/quiz/`;
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

  
}
