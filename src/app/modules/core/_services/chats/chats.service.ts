import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { HandleErrorsService } from '../utils/handle-errors.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../../_models/user';
import { Observable, of } from 'rxjs';
import { Chat } from '../../_models/chat';
import { catchError, map } from 'rxjs/operators';
import { UserView } from '../../_models/userview';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
   private baseUrl = `${environment.apiUrl}chats/`;
   private info: User;
   private httpOptions = {};

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
    private handleErrorsService: HandleErrorsService, 
    private authenticationService: AuthenticationService) { 
      this.info = authenticationService.currentUserValue;
      this.httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
         })

    }
}

  getChatsList(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.baseUrl, this.httpOptions)
    .pipe(
      map(data => data.map(x => {
          return new Chat().deserialize(x, this.sanitizer);
      })),
      catchError(this.handleErrorsService.handleError<Chat[]>("getChatList", [])));   
  }

  createOrGetPersonalChat(userId: string): Observable<string>{
    let params = new HttpParams().set('userId', userId);
    const options = {
        params: params
    };
    return this.http.post<string>(this.baseUrl + "personal", options);
  }

  createGroupChat(titleIn: string, participantsArr: string[]): any{
    const data = {
      title: titleIn, 
      participants: participantsArr
    };
    console.log(data);
    console.log(this.baseUrl + "group");
    console.log(this);
    return this.http.post(this.baseUrl + "group", JSON.stringify(data), this.httpOptions)
    .pipe(catchError(this.handleErrorsService.handleError<any>("createGroupChat", null)));
  }

  searchFriends(term: string): Observable<UserView[]>{
    if(term === ''){
      return of([]);
    }
    return this.http.get<UserView[]>(this.baseUrl+"friends/"+term, this.httpOptions)
    .pipe(
      map(data => data.map(x => {
        return new UserView().deserialize(x, this.sanitizer);
    })),
    catchError(this.handleErrorsService.handleError<UserView[]>("searchFriends", [])));   
  }
}