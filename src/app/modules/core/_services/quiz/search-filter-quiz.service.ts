import {Injectable} from '@angular/core';
import {Quiz} from '../../_models/quiz';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ExtendedQuizPreview} from '../../_models/extendedquiz-preview';
import {DomSanitizer} from '@angular/platform-browser';
import {QuizFilterSettings} from '../../_models/quiz-filter-settings';

@Injectable({
    providedIn: 'root'
})
export class SearchFilterQuizService {

    readonly filterUrl = `${environment.apiUrl}quizzes/filter-quiz-list/page`;
    readonly filterUrlTotalSize = `${environment.apiUrl}quizzes/filter-quiz-list/size`;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            observe: 'response'
        })
    };

    private settings: QuizFilterSettings;
    private currentQuizzesSubject: BehaviorSubject<ExtendedQuizPreview[]>;
    public currentQuizzes: Observable<ExtendedQuizPreview[]>;
    private currentQuizzesSizeSubject: BehaviorSubject<number>;
    public currentQuizzesSize: Observable<number>;

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
        this.currentQuizzesSubject = new BehaviorSubject<ExtendedQuizPreview[]>([]);
        this.currentQuizzes = this.currentQuizzesSubject.asObservable();

        this.currentQuizzesSizeSubject = new BehaviorSubject<number>(0);
        this.currentQuizzesSize = this.currentQuizzesSizeSubject.asObservable();

        this.initSettings();
    }

    search(term: string, newSettings?: boolean) {
        if (newSettings) {
            this.initSettings();
        }
        this.settings.quizName = term;
        this.filterQuiz().subscribe();
    }

    filterQuiz(page?: number): Observable<ExtendedQuizPreview[]> {
        this.filterTotalSize().subscribe(n => this.currentQuizzesSizeSubject.next(n));
        return this.sendReq(this.settings, page ? page : 1);
    }

    filterTotalSize(): Observable<number> {
        const sett = {
            quizName: this.settings.quizName,
            userName: this.settings.userName,
            moreThanRating: this.settings.moreThanRating,
            lessThanRating: this.settings.lessThanRating,
            orderByRating: this.settings.orderByRating,
            tags: this.settings.tags.length > 0 ? this.settings.tags.map(x => x.id) : null,
            categories: this.settings.categories.length > 0  ? this.settings.categories.map(x => x.id) : null,
            quizLang: this.settings.quizLang === 'All' ? null : this.languageEditor(this.settings.quizLang)
        };
        return this.http.post<number>(this.filterUrlTotalSize, sett, this.httpOptions);
    }

    getSettings(): QuizFilterSettings {
        return this.settings;
    }

    setSettings(settings: QuizFilterSettings): void {
        this.settings = settings;
    }

    initSettings() {
        this.settings = {
            quizName: null,
            userName: null,
            moreThanRating: '0',
            lessThanRating: '5',
            orderByRating: null,
            tags: [],
            categories: [],
            quizLang: 'All'
        };
    }

    private sendReq(settings: QuizFilterSettings, page: number): Observable<ExtendedQuizPreview[]> {
        const sett = {
            quizName: settings.quizName,
            userName: settings.userName,
            moreThanRating: settings.moreThanRating,
            lessThanRating: settings.lessThanRating,
            orderByRating: settings.orderByRating,
            tags: settings.tags.length > 0  ? settings.tags.map(x => x.id) : null,
            categories: settings.categories.length > 0  ? settings.categories.map(x => x.id) : null,
            quizLang: settings.quizLang === 'All' ? null : this.languageEditor(settings.quizLang)
        };
        console.log(sett);
        return this.http.post<ExtendedQuizPreview[]>(`${this.filterUrl}/${page}`, JSON.stringify(sett),
            this.httpOptions).pipe(map(data => {
                    const quizzes = data.map(x => {
                        return new ExtendedQuizPreview().deserialize(x, this.sanitizer);
                    });
                    this.currentQuizzesSubject.next(quizzes);
                    console.log(this.currentQuizzesSubject.value);
                    return quizzes;
                }
            ));
    }

    private languageEditor(lang: string) {
        console.log(lang);
        switch (lang) {
            case 'English':
                return 'eng';
            case 'Ukrainian':
                return 'ukr';
            default:
                return lang;
        }
    }
}
