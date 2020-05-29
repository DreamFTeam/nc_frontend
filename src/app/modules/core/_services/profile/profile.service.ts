import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Profile } from '../../_models/profile';
import { catchError, map } from 'rxjs/operators';
import { HandleErrorsService } from '../utils/handle-errors.service';
import { Achievement } from '../../_models/achievement';
import { QuizLastPlayed } from '../../_models/quiz-last-played';
import { ExtendedQuiz } from '../../_models/extended-quiz';

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
  quizzesUrl = `${environment.apiUrl}quizzes/`;
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

  public getProfilebyUserName(query: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.profilesUrl + 'search',
      { headers: this.httpOptions.headers, params: { key: query } }).pipe(map((input) =>
        input.map(data => {
          return Profile.deserialize(data, this.sanitizer);
        })
      ));

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


  public getProfileQuiz(userId: string): Observable<ExtendedQuiz[]> {
    return this.http.get<ExtendedQuiz[]>(`${environment.apiUrl}quizzes/user-list`,
      { headers: this.httpOptions.headers, params: { userId } }).pipe(
        map((data) => data.map(input => {

          if (input.imageContent !== null) {
            input.imageContent =
              this.sanitizer.bypassSecurityTrustUrl
                ('data:image\/(png|jpg|jpeg);base64,'
                  + input.imageContent);
          }
          input.rating = Number(input.rating.toFixed(2));
          return input;
        }
        ))
      );

  }

  public getProfileQuizAmount(userId: string): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}quizzes/user-list/size`,
      { headers: this.httpOptions.headers, params: { userId } }).pipe();

  }

  public getProfileFavQuiz(): Observable<ExtendedQuiz[]> {
    return this.http.get<ExtendedQuiz[]>(`${environment.apiUrl}quizzes/user-fav-list`,
      this.httpOptions).pipe(

        map((data) => data.map(input => {
          if (input.imageContent !== null) {
            input.imageContent =
              this.sanitizer.bypassSecurityTrustUrl
                ('data:image\/(png|jpg|jpeg);base64,'
                  + input.imageContent);
          }
          input.rating = Number(input.rating.toFixed(2));
          return input;
        }
        ))
      );

  }

  public getProfileFavQuizAmount(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}quizzes/user-fav-list/size`,
      this.httpOptions).pipe();

  }

  public getPopularCreators(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.profilesUrl + 'popular-creators',
      { headers: this.httpOptions.headers }).pipe(map((input) =>
        input.map(data => {
          return Profile.deserialize(data, this.sanitizer);
        })
      ));
  }

  public getPrivilegedUsers(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.profilesUrl + 'privileged-users',
      { headers: this.httpOptions.headers }).pipe(map((input) =>
        input.map(data => {
          return Profile.deserialize(data, this.sanitizer);
        })
      ));

  }
  public getProfileAchievement(targetId: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.profilesUrl + targetId + '/achievements',
      this.httpOptions).pipe(

        map((data) => data.map(achievement => {
          return new Achievement().deserialize(achievement, this.sanitizer);
        }
        )));

  }

  public getProfileAchievementAmount(targetId: string): Observable<number> {
    return this.http.get<number>(this.profilesUrl + targetId + '/achievements/size',
      this.httpOptions).pipe();

  }

  public getLastAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.profilesUrl + 'achievements/last-week',
      this.httpOptions).pipe(map(
        (data) => data.map(achievement => {
          return new Achievement().deserialize(achievement, this.sanitizer);

        })), catchError(this.errorHandler.handleError<Achievement[]>('getLastAchievements', [])));
  }

  public getLastPlayedGames(): Observable<QuizLastPlayed[]> {
    return this.http.get<QuizLastPlayed[]>(this.quizzesUrl + 'last-played',
      this.httpOptions)
      .pipe(catchError(this.errorHandler.handleError<QuizLastPlayed[]>('getLastPlayedGames', [])));
  }

}