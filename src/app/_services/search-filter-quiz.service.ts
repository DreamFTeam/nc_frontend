import {Injectable} from '@angular/core';
import {Quiz} from '../_models/quiz';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterQuizService {

  readonly filterUrl = `${environment.apiUrl}quiz/filter-quiz-list`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response'
    })
    // , params: new HttpParams()
  };

  constructor(private http: HttpClient) {
  }

  searchQuiz(quizName: string): Observable<Quiz[]> {
    if (!quizName.trim()) {
      return of([]);
    }
    // this.httpOptions.params = new HttpParams().set('quizName', quizName);
    // return this.http.get<Quiz[]>(this.filterUrl, this.httpOptions);
    return this.http.post<Quiz[]>(this.filterUrl, JSON.stringify(quizName), this.httpOptions);
  }

  filterQuiz(quizName: string,
             userName: string,
             moreThanRating: string,
             lessThanRating: string,
             orderByRating: boolean,
             tags: string[],
             categories: string[]): Observable<Quiz[]> {
    // const params = new HttpParams()
    //   .set('quizName', quizName)
    //   .set('userName', userName)
    //   .set('moreThanRating', moreThanRating)
    //   .set('lessThanRating', lessThanRating)
    //   .set('orderByRating', String(orderByRating))
    //   .set('tags', tags.join(','))
    //   .set('categories', categories.join(','));
    // this.httpOptions.params = params;
    // return this.http.get<Quiz[]>(this.filterUrl, this.httpOptions);

    const quizInfo = {
      quizName,
      userName,
      moreThanRating,
      lessThanRating,
      orderByRating,
      tags,
      categories
    };
    return this.http.post<Quiz[]>(this.filterUrl, JSON.stringify(quizInfo), this.httpOptions);
  }


}
