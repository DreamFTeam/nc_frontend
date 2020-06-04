import { Injectable } from '@angular/core';
import { Activity } from '../../_models/activity';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';
import { HandleErrorsService } from '../utils/handle-errors.service';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {

    private baseUrl = `${environment.apiUrl}activities`;

    constructor(private http: HttpClient,
        private sanitizer: DomSanitizer,
        private handleErrorsService: HandleErrorsService) {
    }

    getActivityList(start: number, amount: number): Observable<Activity[]> {
        const options = {
            params: new HttpParams().set('startIndex', start.toString()).set('amount', amount.toString())
        };

        return this.http.get<Activity[]>(this.baseUrl, options)
            .pipe(map(data => data.map(x => {
                return new Activity().deserialize(x, this.sanitizer);
            }), catchError(this.handleErrorsService.handleError<Activity[]>('getActivityList', []))));
    }

    getActivitySize(): Observable<number> {
        return this.http.get<number>(this.baseUrl + "/totalsize")
            .pipe(
                catchError(this.handleErrorsService.handleError<number>('getActivitySize', 0))
            );
    }

}
