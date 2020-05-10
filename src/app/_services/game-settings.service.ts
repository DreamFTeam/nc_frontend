import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Game} from '../_models/game';
import {SseService} from './sse.service';
import {GameSession} from '../_models/game-session';

@Injectable({
  providedIn: 'root'
})
export class GameSettingsService {
  gameUrl = `${environment.apiUrl}games/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient,
              private sseService: SseService) { }

  createGame(settings: any): Observable<Game> {
    if (!settings.additionalPoints) {
      settings.additionalPoints = false;
    }
    console.log(settings);
    return this.http.post<Game>(this.gameUrl, JSON.stringify(settings), this.httpOptions);
  }

  getGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(this.gameUrl + `game/${gameId}`, this.httpOptions);
  }

  join(accessId: string): Observable<GameSession> {
    return this.http.get<GameSession>(this.gameUrl + `join/${accessId}`, this.httpOptions);
  }
}
