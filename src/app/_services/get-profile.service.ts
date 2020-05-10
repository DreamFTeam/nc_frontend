import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';
import {Profile} from '../_models/profile';
import {catchError} from 'rxjs/operators';
import {User} from '../_models/user';
import {Quiz} from '../_models/quiz';
import {AuthenticationService} from './authentication.service';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class GetProfileService {
  profilesUrl = `${environment.apiUrl}profiles/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  user: User;


  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {
    this.user = authenticationService.currentUserValue;
  }

  public getCurrentProfile(): string {
    return this.user.username;
  }


  public getProfile(profile: string): Observable<Profile> {
    console.log(this.profilesUrl + profile);

    const options = {
      headers: this.httpOptions.headers,
    };


    return this.http.get<Profile>(this.profilesUrl + profile,
      options).pipe();

  }

  public getUsers(): Observable<Profile[]> {
    const params = new HttpParams();

    return this.http.get<Profile[]>(this.profilesUrl, {params}).pipe();
  }

  public getProfilebyUserName(query: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.profilesUrl + 'search',
      {headers: this.httpOptions.headers, params: {key: query}}).pipe();

  }

  public editProfile(field: string, value: string): Observable<Profile> {
    return this.http.post<Profile>(this.profilesUrl + 'edit/' + field,
      null, {params: {key: value}}
    ).pipe(catchError(this.handleError<any>('EditProfile')));

  }

  public uploadPicture(value: FormData) {

    return this.http.post<Profile>(this.profilesUrl + 'edit/image', value)
      .pipe(catchError(this.handleError<any>('EditProfile')));
  }


  public getProfileQuiz(userId: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${environment.apiUrl}quizzes/` + 'user-list',
      {headers: this.httpOptions.headers, params: {userId}}).pipe();

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      return of(result as T);
    };
  }
}
