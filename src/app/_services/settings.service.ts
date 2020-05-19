import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Setting } from '../_models/setting';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocaleService } from './locale.service';

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
    private localeService: LocaleService) {
  }

  getSettings(): Observable<Setting[]>{
    return this.http.get<Setting[]>(this.baseUrl)
      .pipe(map(data => data.map(x => {
        return new Setting().deserialize(x);
      })));
  }

  getLanguage():Observable<Setting>{
    return this.http.get<Setting>(this.baseUrl+"/language")
      .pipe(map(data => {
        return new Setting().deserialize(data);
      }));
  }

  saveSettings(settings, language){
    this.localeService.setLang(language.value);

    const saved = settings.map(el => ({ ... (el) })).concat(Object.assign({}, language));

    saved.map(el => ["title", "description"].map(x => delete el[x]));
    saved.map(el => el.value = el.value.toString());

    return this.http.post(this.baseUrl, JSON.stringify(saved), this.httpOptions);
  }
}
