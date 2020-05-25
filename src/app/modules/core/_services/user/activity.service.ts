import {Injectable} from '@angular/core';
import {Activity} from '../../_models/activity';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators/map';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {

    private baseUrl = `${environment.apiUrl}activities`;

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    }

    getActivityList(): Observable<Activity[]> {
        return this.http.get<Activity[]>(this.baseUrl)
            .pipe(map(data => data.map(x => {
                console.log(x);
                return new Activity().deserialize(x, this.sanitizer);
            })));
    }

}
