import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  usersUrl = `https://qznetbc.herokuapp.com/api/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe : 'response'
    })
  };

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userToken')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /* POST: login user */
  loginUser(username: string, password: string): Observable<User> {
    const userInfo = {
      username: username,
      email: username,
      password
    };
    return this.http.post<User>(this.usersUrl + 'log-in', JSON.stringify(userInfo), this.httpOptions).pipe(
      map(data => {
        const token: User = data;
        localStorage.setItem('userData', JSON.stringify(token));
        this.currentUserSubject.next(token);
        return token;
      })
    );
  }

  /* POST: signup user */
  signupUser(username: string, email: string, password: string): Observable<User> {
    const userInfo = {
      username,
      password,
      email
    };
    return this.http.post<User>(this.usersUrl + 'sign-up', JSON.stringify(userInfo), this.httpOptions);
  }

  /* POST: recover password */
  recoverPassword( email: string): Observable<any> {
    const userInfo = {
      email
    };
    return this.http.post<User>(this.usersUrl + 'recovery/send', JSON.stringify(userInfo), this.httpOptions).pipe(
      catchError(this.handleError<User>('recoverPassword'))
    );
  }

  /* POST: change password */
  changePassword(recoverUrl: string, password: string): Observable<any> {
    const userInfo = {
      recoverUrl,
      password
    };
    return this.http.post(this.usersUrl + 'recovery/changePassword', JSON.stringify(userInfo), this.httpOptions);
  }


  /* POST: logout a user */
  signoutUser(): void {
    const userInfo = {
      Token: this.currentUserValue.token
    };
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    throwError('Backend is not ready'); // DELETE WHEN THE backend logout IS IMPLEMENTED
    this.http.post(this.usersUrl + 'logout', userInfo, this.httpOptions).pipe(
      catchError(this.handleError<any>('signOutUser'))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      return of(result as T);
    };
  }

  private extractData(res: Response) {
    return res || { };
  }
}
