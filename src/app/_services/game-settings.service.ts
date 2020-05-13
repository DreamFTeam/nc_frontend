import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Game} from '../_models/game';
import {SseService} from './sse.service';
import {GameSession} from '../_models/game-session';
import {catchError} from 'rxjs/operators';
import {HandleErrorsService} from './handle-errors.service';

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
              private errorsService: HandleErrorsService) {
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
  getUsers(gameId: string): Observable<any> {
    return this.http.get<any>(this.gameUrl + `sessions/${gameId}`, this.httpOptions);
  }

  setReady(gameId: string) {
    return this.http.post(this.gameUrl + `game/${gameId}/ready`, this.httpOptions)
      .pipe(catchError(this.errorsService.handleError('setReady')));
  }

  startGame(gameId: string): Observable<any> {
    return this.http.post(this.gameUrl + `start`, null,
      {headers: this.httpOptions.headers, params: {gameId}})
      .pipe(catchError(this.errorsService.handleError('startGame')));
  }

}
