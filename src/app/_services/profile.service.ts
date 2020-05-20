import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Profile } from '../_models/profile';
import { catchError, map } from 'rxjs/operators';
import { Quiz } from '../_models/quiz';
import { HandleErrorsService } from './handle-errors.service';
import { Achievement } from '../_models/achievement';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  public AMOUNT_OF_USERS = 8;

  private rolesHierarchy = {
    ROLE_USER: 10,
    ROLE_MODERATOR: 0,
    ROLE_ADMIN: 1,
    ROLE_SUPERADMIN: 2
  };

  profilesUrl = `${environment.apiUrl}profiles/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private errorHandler: HandleErrorsService) {
  }


  public compare(role1: string, role2: string): boolean {
    return (this.rolesHierarchy[role1] - this.rolesHierarchy[role2]) > 0;
  }

  public getProfile(profile: string): Observable<Profile> {

    return this.http.get<Profile>(this.profilesUrl + profile,
      { headers: this.httpOptions.headers }).pipe(
        map(data => {
          return Profile.deserialize(data, this.sanitizer);
        })
      );

  }

  public getUsers(): Observable<Profile[]> {
    const params = new HttpParams();

    return this.http.get<Profile[]>(this.profilesUrl, { params }).pipe();
  }

  public getProfilebyUserName(query: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.profilesUrl + 'search',
      { headers: this.httpOptions.headers, params: { key: query } }).pipe();

  }

  public editProfile(field: string, value: string): Observable<Profile> {
    return this.http.post<Profile>(this.profilesUrl + 'edit/' + field,
      null, { params: { key: value } }
    ).pipe(catchError(this.errorHandler.handleError<any>('EditProfile')));

  }

  public uploadPicture(value: FormData) {

    return this.http.post<Profile>(this.profilesUrl + 'edit/image', value)
      .pipe(catchError(this.errorHandler.handleError<any>('uploadPicture')));
  }


  public getProfileQuiz(userId: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${environment.apiUrl}quizzes/user-list`,
      { headers: this.httpOptions.headers, params: { userId } }).pipe();

  }

  public getProfileFavQuiz(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${environment.apiUrl}quizzes/user-fav-list`,
      this.httpOptions).pipe();

  }


  public getProfileAchievement(targetId: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.profilesUrl + targetId + '/achievements',
      this.httpOptions).pipe(
        map((data) => data.map(achievement => {
          return new Achievement().deserialize(achievement, this.sanitizer);
        }
        )));

  }

  public getLastAchievements(): Observable<Achievement[]>{
    return this.http.get<Achievement[]>(this.profilesUrl + 'achievements/last-week',
      this.httpOptions).pipe(map((data) => data.map(achievement => {
        return new Achievement().deserialize(achievement, this.sanitizer);
      }))
    );
  }

}
