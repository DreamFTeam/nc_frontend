import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Suggestion } from '../_models/suggestion';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  
  private baseUrl = `${environment.apiUrl}quizzes/suggestions-list`;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  getSuggestionList(): Observable<Suggestion[]>{
    return this.http.get<Suggestion[]>(this.baseUrl)
      .pipe(map(data => data.map(x => {
        console.log(x);
        return new Suggestion().deserialize(x, this.sanitizer);
      })));
  }
}
