import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminDashboardService {

    private readonly popularQuizWeekURL = `${environment.apiUrl}quizzes/popular`;
    private readonly quizzesStatusesURL = `${environment.apiUrl}quizzes/statuses`;
    private readonly quizzesValidInvalidURL = `${environment.apiUrl}quizzes/statistic`;
    private readonly gamesAmountPerDayURL = `${environment.apiUrl}games/amount-per-day`;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            observe: 'response'
        })
    };
    constructor(private http: HttpClient) {
    }

    getPopularQuizWeek(amount: number): Observable<any> {
        return this.http.get(this.popularQuizWeekURL,
            {headers: this.httpOptions.headers, params: {amount: amount.toString()}});
    }

    getQuizzesStatuses(): Observable<any> {
        return this.http.get(this.quizzesStatusesURL, this.httpOptions);
    }

    getQuizzesValidInvalid(): Observable<any> {
        return this.http.get(this.quizzesValidInvalidURL, this.httpOptions);
    }

    getGamesAmountPerDay(): Observable<any> {
        return this.http.get(this.gamesAmountPerDayURL, this.httpOptions);
    }
}
