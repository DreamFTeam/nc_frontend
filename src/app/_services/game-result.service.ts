import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GameSession} from "../_models/game-session";

@Injectable({
  providedIn: 'root'
})
export class GameResultService {

  url = `${environment.apiUrl}games/sessions/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private http: HttpClient) {

  }

  getResults(gameId: string) {
    return this.http.get(this.url + gameId, this.httpOptions);
  }
}
