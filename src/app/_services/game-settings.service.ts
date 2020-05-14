import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Game} from '../_models/game';
import {SseService} from './sse.service';
import {GameSession} from '../_models/game-session';
import {catchError} from 'rxjs/operators';
import {HandleErrorsService} from './handle-errors.service';
import {AnonymService} from './anonym.service';

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
              private sseService: SseService,
              private errorsService: HandleErrorsService,
              private anonymService: AnonymService) {
  }

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
    return this.http.get<GameSession>(this.gameUrl + `join/${accessId}`,
      this.httpOptions);
  }

  // TODO Set images
  getSessions(gameId: string): Observable<any> {
    return this.http.get<any>(this.gameUrl + `sessions/${gameId}`, this.httpOptions);
  }

  setReady(gameId: string, sessionId: string) {
    return this.http.post(this.gameUrl + `game/${gameId}/ready`, {},
      {headers: this.httpOptions.headers, params: {sessionId}})
      .pipe(catchError(this.errorsService.handleError('setReady')));
  }

  startGame(gameId: string): Observable<any> {
    return this.http.post(this.gameUrl + `start`, null,
      {headers: this.httpOptions.headers, params: {gameId}})
      .pipe(catchError(this.errorsService.handleError('startGame')));
  }

  quitGame(sessionId: string) {
    this.anonymService.removeAnonym();
    return this.http.post(this.gameUrl + `quit`, null,
      {headers: this.httpOptions.headers, params: {sessionId}})
      .pipe(catchError(this.errorsService.handleError('quitGame')));
  }
}
