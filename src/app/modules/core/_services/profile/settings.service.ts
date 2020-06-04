import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Setting } from '../../_models/setting';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LocaleService } from '../utils/locale.service';
import { environment } from 'src/environments/environment';
import { HandleErrorsService } from '../utils/handle-errors.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private baseUrl = `${environment.apiUrl}settings`;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient,
        private localeService: LocaleService,
        private handleErrorsService: HandleErrorsService) {
    }

    getSettings(): Observable<Setting[]> {
        return this.http.get<Setting[]>(this.baseUrl)
            .pipe(map(data => data.map(x => {
                return new Setting().deserialize(x);
            }),
                catchError(this.handleErrorsService.handleError<Setting[]>('getSettings', []))
            ));
    }

    getLanguage(): Observable<any> {
        return this.http.get<any>(this.baseUrl + '/language').pipe(
            catchError(this.handleErrorsService.handleError<any>('getLanguage'))
        );
    }

    saveSettings(settings, language) {
        this.localeService.setLang(language.value);

        const saved = settings.map(el => ({ ...(el) })).concat(Object.assign({}, language));

        saved.map(el => ['title', 'description'].map(x => delete el[x]));
        saved.map(el => el.value = el.value.toString());

        return this.http.put(this.baseUrl, JSON.stringify(saved), this.httpOptions).pipe(
            catchError(this.handleErrorsService.handleError<any>('saveSettings'))
        );
    }
}
