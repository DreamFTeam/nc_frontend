import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GameResult} from '../../_models/game-result';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class GameResultService {

    private url = `${environment.apiUrl}games/sessions/`;
    private ratingSetUrl = `${environment.apiUrl}games/rate-quiz`;
    private ratingGetUrl = `${environment.apiUrl}quizzes/`;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };


    constructor(private http: HttpClient,
                private authenticationService: AuthenticationService) {

    }

    getResults(gameId: string): Observable<GameResult[]> {
        return this.http.get<GameResult[]>(this.url + `${gameId}`, this.httpOptions);
    }

    getRating(quizId: string): Observable<any> {
        return this.http.get(`${this.ratingGetUrl}${quizId}/rating`, this.httpOptions);
    }

    sendRating(gameId: string, ratePoints: number) {
        return this.http.post(this.ratingSetUrl, {},
            {headers: this.httpOptions.headers, params: {sessionId: gameId, ratingPoints: ratePoints.toString()}});
    }
}
