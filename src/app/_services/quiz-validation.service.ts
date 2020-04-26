import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizValidationService {
/*  private baseUrl = 'https://qznetbc.herokuapp.com/api/quiz/';
  private quizListUrl = 'quiz-list/';
  private totalSizeUrl = 'getquiztotalsize/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      Bearer
    })
  };

  constructor(private http: HttpClient) { }

  getQuizzesByPage(pageToSend: number): Observable<QuizPreview[]> {
    return this.http.
      get<QuizPreview[]>(this.baseUrl + this.quizListUrl + pageToSend, this.httpOptions).pipe(
        catchError(this.handleError<QuizPreview[]>('getQuizzesByPage', []))
      );
  }

  getTotalSize(): Observable<number>{
    return this.http.get<number>(this.baseUrl + this.totalSizeUrl, this.httpOptions)
        .pipe(catchError(this.handleError<number>('getTotalSize', 0)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      return of(result as T);
    };
    }*/
}
