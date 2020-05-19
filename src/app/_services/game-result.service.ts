import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GameSession} from "../_models/game-session";
import {Observable} from "rxjs";
import {Profile} from "../_models/profile";
import {GameResult} from "../_models/game-result";

@Injectable({
  providedIn: 'root'
})
export class GameResultService {

  url = `${environment.apiUrl}games/sessions/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiUk9MRV9VU0VSIiwiaWQiOiIwYTFlNTdhYy1jZjZjLTQ5ZmUtODkzYS03NzcwMTgzMzEwYmUiLCJleHAiOjE1OTAwMDk2NzIsImlhdCI6MTU4OTcwOTY3MiwiZW1haWwiOiJlbWFpbG5ldyIsInVzZXJuYW1lIjoiZmlyc3QifQ.3utNFYXo5-Q-F2R_MxRTRCbW7p9AQHKnxPfeyOLxirFX2xWM7YbjgYdnMW2iQuUBohBG_Ujv02SLdQ9nkvwkgg'
    })
  };


  constructor(private http: HttpClient) {

  }

  getResults(gameId: string): Observable<GameResult[]> {
    return this.http.get<GameResult[]>(this.url + `${gameId}`, this.httpOptions);
  }
}
