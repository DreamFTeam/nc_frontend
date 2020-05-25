import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../_models/user';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class PrivilegedService {
    private user;
    private url = `${environment.apiUrl}admins`;
    private httpOptions;

    constructor(private http: HttpClient,
                private authenticationService: AuthenticationService) {
        this.user = authenticationService.currentUserValue;
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }


    public create(username: string, email: string, password: string, userrole: string): Observable<any> {
        const userInfo = {
            username,
            email,
            password,
            role: userrole,
        };
        return this.http.post<User>(this.url, JSON.stringify(userInfo), this.httpOptions).pipe(
            catchError(err => {
                return throwError(err);
            }));
    }


    public deactivate(id: string, activation: boolean): Observable<any> {
        const userInfo = {
            id,
            activation
        };
        return this.http.post<User>(this.url + '/activation', JSON.stringify(userInfo), this.httpOptions).pipe(
            catchError(err => {
                return throwError(err);
            }));
    }


    public edit(id: string, field: string, value: any): Observable<any> {

        const userInfo = {
            id
        };
        userInfo[field] = (field !== 'role') ? value : value === true ? 'ROLE_ADMIN' : 'ROLE_MODERATOR';

        return this.http.post<User>(this.url + '/edit/' + field, JSON.stringify(userInfo), this.httpOptions).pipe(
            catchError(err => {
                return throwError(err);
            }));
    }


    public uploadPicture(value: FormData) {
        return this.http.post<any>(this.url + '/edit/image', value).pipe();
    }

}

