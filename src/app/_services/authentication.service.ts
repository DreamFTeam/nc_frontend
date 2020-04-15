import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {User} from '../_models/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  usersUrl = `${environment.apiUrl}users/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
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
  loginUser(login: string, password: string): Observable<User> {
    const userInfo = {
      username: login,
      password
    };
    return this.http.post<User>(this.usersUrl + 'login', this.httpOptions).pipe(
      map(data => {
        const token: User = data;
        localStorage.setItem('userData', JSON.stringify(token));
        this.currentUserSubject.next(token);
        return token;
      }),
      catchError(this.handleError<User>('loginUser'))
    );
  }

  /* POST: signup user */
  signupUser(username: string, email: string, password: string): Observable<User> {
    const userInfo = {
      username,
      password,
      email
    };
    return this.http.post<User>(this.usersUrl + 'registration', JSON.stringify(userInfo), this.httpOptions).pipe(
      catchError(this.handleError<User>('signupUser'))
    );
  }

  /* POST: recover password */
  recoverPassword( email: string): void {
    const userInfo = {
      email
    };
    throwError('Backend is not ready'); // DELETE WHEN THE backend recover password WILL BE IMPLEMENTED
    this.http.post<User>(this.usersUrl + 'recoverpass', JSON.stringify(userInfo), this.httpOptions).pipe(
      catchError(this.handleError<User>('recoverPassword'))
    );
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
}
