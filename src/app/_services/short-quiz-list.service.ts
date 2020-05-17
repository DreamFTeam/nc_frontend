import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {HandleErrorsService} from './handle-errors.service';
import {ExtendedQuiz} from '../_models/extended-quiz';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AuthenticationService} from './authentication.service';
import {User} from '../_models/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShortQuizListService {

  private baseUrl = `${environment.apiUrl}quizzes/`;
  private shortListUrl = 'short-list';

  private httpOptions = {};

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
              private handleErrorsService: HandleErrorsService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getShortQuizList(): Observable<ExtendedQuiz[]> {
    console.log(this.baseUrl + this.shortListUrl);
    return this.http.get<ExtendedQuiz[]>(this.baseUrl + this.shortListUrl, this.httpOptions)
      .pipe(map(data => data.map(x => {
        return new ExtendedQuiz().deserialize(x, this.sanitizer);
      }), catchError(this.handleErrorsService.handleError<ExtendedQuiz[]>('getShortQuizList', []))));
  }

}
