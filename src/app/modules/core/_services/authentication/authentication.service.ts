import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../../_models/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import * as jwt_decode from 'jwt-decode';
import * as sha1 from 'js-sha1';
import {SettingsService} from '../profile/settings.service';
import {LocaleService} from '../utils/locale.service';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public readonly PASSWORD_HASHING_ITERATIONS_AMOUNT = 5;
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
            password: this.passwordHashing(password, this.PASSWORD_HASHING_ITERATIONS_AMOUNT)
        };

        return this.http.post<User>(this.url + 'log-in', JSON.stringify(userInfo), this.httpOptions).pipe(
            map(data => {
                const tokenJSON: any = data;
                localStorage.setItem('userData', tokenJSON.token);
                const userDecode: User = jwt_decode(tokenJSON.token);
                this.currentUserSubject.next(userDecode);
                this.localeService.initUserLang(this.settingsService.getLanguage());
                return userDecode;
            })
        );
    }

    /* POST: signup user */
    signupUser(username: string, email: string, password: string): Observable<User> {
        const userInfo = {
            username,
            password: this.passwordHashing(password, this.PASSWORD_HASHING_ITERATIONS_AMOUNT),
            email,
            language: this.localeService.getLanguage()
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

    /* PATCH: change password */
    changePassword(recoverUrl: string, password: string): Observable<any> {
        const userInfo = {
            recoverUrl,
            password: this.passwordHashing(password, this.PASSWORD_HASHING_ITERATIONS_AMOUNT)
        };
        return this.http.patch(this.url + 'recovery/changePassword', JSON.stringify(userInfo), this.httpOptions);
    }


    signoutUser(): void {
        localStorage.removeItem('userData');
        this.currentUserSubject.next(null);

        this.localeService.initAnonymousLang();
    }

    /* PATCH: change user password (using current password) */
    changeUserPassword(currentPassword: string, newPassword: string): Observable<any> {
        const userInfo = {
            currentPassword: this.passwordHashing(currentPassword, this.PASSWORD_HASHING_ITERATIONS_AMOUNT),
            newPassword: this.passwordHashing(newPassword, this.PASSWORD_HASHING_ITERATIONS_AMOUNT)
        };
        return this.http.patch(this.url + 'account/changePassword', JSON.stringify(userInfo), this.httpOptions);
    }

    passwordHashing(password: string, iterations?: number) {
        let crypt = sha1(password);
        for (let i = 0; i < iterations; ++i) {
            crypt = sha1(crypt);
        }
        console.log(crypt);
        return crypt;
    }
}
