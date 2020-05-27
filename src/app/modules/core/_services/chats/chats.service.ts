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
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        params: params
    };
    return this.http.post<string>(this.baseUrl + 'personal', null, options).pipe(
      map(x => {
          const chatId: any = x;
          return chatId.chatId;
      })
  );
  }

  createGroupChat(titleIn: string, participantsArr: string[]): Observable<string>{
    const data = {
      title: titleIn, 
      participants: participantsArr
    };
    return this.http.post<string>(this.baseUrl + "group", JSON.stringify(data), this.httpOptions)
    .pipe(map(x => {
      const chatId: any = x;
      return chatId.chatId;
    } ),catchError(this.handleErrorsService.handleError<string>("createGroupChat", null)));
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