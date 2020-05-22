import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as jwt_decode from 'jwt-decode';
import { SettingsService } from './settings.service';
import { LocaleService } from './locale.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  url = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response'
    })
  };

  constructor(private http: HttpClient,
    private localeService: LocaleService,
    private settingsService: SettingsService) {
    this.currentUserSubject = new BehaviorSubject<User>(

      localStorage.getItem('userData') ? jwt_decode(localStorage.getItem('userData')) : undefined);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /* POST: login user */
  loginUser(username: string, password: string): Observable<User> {

    const userInfo = {
      username,
      email: username,
      password
    };

    let res = this.http.post<User>(this.url + 'log-in', JSON.stringify(userInfo), this.httpOptions).pipe(
      map(data => {
        const tokenJSON: any = data;
        localStorage.setItem('userData', tokenJSON.token);
        const userDecode: User = jwt_decode(tokenJSON.token);
        console.log(userDecode);
        this.currentUserSubject.next(userDecode);
        this.localeService.initUserLang(this.settingsService.getLanguage());
        return userDecode;
      })
    );

    

    return res;
  }

  /* POST: signup user */
  signupUser(username: string, email: string, password: string): Observable<User> {
    const userInfo = {
      username,
      password,
      email
    };
    return this.http.post<User>(this.url + 'sign-up', JSON.stringify(userInfo), this.httpOptions);
  }

  /* POST: recover password */
  recoverPassword(email: string): Observable<any> {
    const userInfo = {
      email
    };
    return this.http.post<User>(this.url + 'recovery/send', JSON.stringify(userInfo), this.httpOptions);
  }

  /* POST: change password */
  changePassword(recoverUrl: string, password: string): Observable<any> {
    const userInfo = {
      recoverUrl,
      password
    };
    return this.http.post(this.url + 'recovery/changePassword', JSON.stringify(userInfo), this.httpOptions);
  }


  signoutUser(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem("userLang")
    this.currentUserSubject.next(null);

    this.localeService.setAnonymousLang();
  }

  /* PATCH: change user password (using current password) */
  changeUserPassword(currentPassword: string, newPassword: string): Observable<any> {
    const userInfo = {
      currentPassword,
      newPassword
    };
    return this.http.patch(this.url + 'account/changePassword', JSON.stringify(userInfo), this.httpOptions);
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      return of(result as T);
    };
  }

  private extractData(res: Response) {
    return res || {};
  }
}
