import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of,  } from 'rxjs';
import { Profile } from '../_models/profile';
import { catchError } from 'rxjs/operators';
import {Quiz} from '../_models/quiz'

@Injectable({
  providedIn: 'root'
})
export class GetProfileService {
  private user;
  private profilesUrl = `${environment.apiUrl}profiles/`;
  private httpOptions;


  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.user.token
      })
    };
  }

  public static getCurrentProfile(): string {
    return JSON.parse(localStorage.getItem('userData')).username;
  }


  public getProfile(profile: string): Observable<Profile> {
    return this.http.get<Profile>(this.profilesUrl + profile,
      {
        headers: this.httpOptions.headers,
        params: { key: profile }
      }).pipe();

  }

  public getProfilebyUserName(query: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.profilesUrl + 'search',
      { headers: this.httpOptions.headers, params: { key: query } }).pipe();

  }

  public editProfile(field: string, value: string): Observable<Profile> {
    if (field === 'aboutMe' || field === 'image') {
      const obj = {};
      obj[field] = value;
      return this.http.post<Profile>(this.profilesUrl + 'edit/' + field, JSON.stringify(obj)
        , this.httpOptions).pipe(catchError(this.handleError<any>('EditProfile')));
    }
  }

  
  public getProfileQuiz(userId: string): Observable<Quiz[]> {
         return this.http.get<Quiz[]>(`${environment.apiUrl}quiz/` + 'getuserquizlist',
        { headers: this.httpOptions.headers, params: {userId } }).pipe();

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      return of(result as T);
    };
  }

}