import {Injectable} from '@angular/core';
import {Quiz} from '../_models/quiz';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Tag} from '../_models/tag';
import {Category} from '../_models/category';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {ExtendedQuizPreview} from '../_models/extendedquiz-preview';
import {DomSanitizer} from '@angular/platform-browser';

export interface QuizFilterSettings {
  quizName: string;
  userName: string;
  moreThanRating: string;
  lessThanRating: string;
  orderByRating: boolean;
  tags: Tag[];
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchFilterQuizService {

  readonly filterUrl = `${environment.apiUrl}quizzes/filter-quiz-list/page`;
  readonly searchUrl = `${environment.apiUrl}quizzes/search`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response',
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).token

    })
    , params: new HttpParams()
  };

  page = 1;

  sett = {
    quizName: null,
    userName: null,
    moreThanRating: '0',
    lessThanRating: '5',
    orderByRating: true,
    tags: null,
    categories: null
  };
  private currentQuizzesSubject = new BehaviorSubject<ExtendedQuizPreview[]>({} as ExtendedQuizPreview[]);
  public currentQuizzes = this.currentQuizzesSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {

  }

  searchQuiz(quizName: string): void {
    // this.httpOptions.params = new HttpParams().set('quizName', quizName);
    // return this.http.get<Quiz[]>(this.filterUrl, this.httpOptions);
    const settings = this.getSettings();
    settings.quizName = quizName;
    this.saveSettings(settings);
    this.sett.quizName = quizName;
    this.sendReq(this.sett);
  }

  filterQuiz(): Observable<ExtendedQuizPreview[]> {
    // const params = new HttpParams()
    //   .set('quizName', quizName)
    //   .set('userName', userName)
    //   .set('moreThanRating', moreThanRating)
    //   .set('lessThanRating', lessThanRating)
    //   .set('orderByRating', String(orderByRating))
    //   .set('tags', tags.join(','))
    //   .set('categories', categories.join(','));
    // this.httpOptions.params = params;
    // return this.http.get<Quiz[]>(this.filterUrl, this.httpOptions);
    const settings = this.getSettings();
    this.sett = {
      quizName: settings.quizName,
      userName: settings.userName,
      moreThanRating: settings.moreThanRating,
      lessThanRating: settings.lessThanRating,
      orderByRating: settings.orderByRating,
      tags: settings.tags.length ? settings.tags.map(x => x.tag_id) : null,
      categories: settings.categories.length ? settings.categories.map(x => x.category_id) : null
    };
    console.log(this.sett);
    return this.sendReq(this.sett);
  }

  updPage(page: number) {
    this.page = page;
    this.filterQuiz().subscribe();
  }

  saveSettings(quizInfo: QuizFilterSettings) {
    localStorage.setItem('quiz-filter', JSON.stringify(quizInfo));
    this.filterQuiz();
  }

  getSettings(): QuizFilterSettings {
    return JSON.parse(localStorage.getItem('quiz-filter'));
  }


  searchTags(term: string, amount: string) {
    if (!term.trim()) {
      return of([]);
    }
    const params = new HttpParams().set('term', term).set('amount', amount);
    this.httpOptions.params = params;
    return this.http.get<Quiz[]>(this.searchUrl + '/tags', this.httpOptions);
  }

  searchCategories(term: string, amount: string) {
    if (!term.trim()) {
      return of([]);
    }
    const params = new HttpParams().set('term', term).set('amount', amount);
    this.httpOptions.params = params;
    return this.http.get<Quiz[]>(this.searchUrl + '/categories', this.httpOptions);
  }

  private sendReq(settings): Observable<ExtendedQuizPreview[]> {
    let s = this.http.post<ExtendedQuizPreview[]>(this.filterUrl + '/' + this.page, JSON.stringify(settings), this.httpOptions).pipe(
      map(data => {
        const quizzes =  data.map(x => {
          console.log(x);
          return new ExtendedQuizPreview().deserialize(x, this.sanitizer);
          });
        this.currentQuizzesSubject.next(quizzes);
        console.log(this.getCurrentQuizzes());
        return quizzes;
        }
      ));

    return s;
  }

  setQuizzes(quizzes: ExtendedQuizPreview[]) {
    this.currentQuizzesSubject.next(quizzes);
  }

  getCurrentQuizzes(): ExtendedQuizPreview[] {
    return this.currentQuizzesSubject.value;
  }
}
