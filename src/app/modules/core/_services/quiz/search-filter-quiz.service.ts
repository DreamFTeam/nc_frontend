import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {ExtendedQuizPreview} from '../../_models/extendedquiz-preview';
import {DomSanitizer} from '@angular/platform-browser';
import {QuizFilterSettings} from '../../_models/quiz-filter-settings';
import {LocaleService} from '../utils/locale.service';

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
    public currentQuizzes$: Observable<ExtendedQuizPreview[]>;
    private currentQuizzesSizeSubject: BehaviorSubject<number>;
    public currentQuizzesSize$: Observable<number>;
    private loadingSubject: BehaviorSubject<boolean>;
    public loading$: Observable<boolean>;

    constructor(private http: HttpClient,
                private sanitizer: DomSanitizer,
                private localeService: LocaleService) {
        this.currentQuizzesSubject = new BehaviorSubject<ExtendedQuizPreview[]>([]);
        this.currentQuizzes$ = this.currentQuizzesSubject.asObservable();

        this.currentQuizzesSizeSubject = new BehaviorSubject<number>(0);
        this.currentQuizzesSize$ = this.currentQuizzesSizeSubject.asObservable();
        this.loadingSubject = new BehaviorSubject<boolean>(false);
        this.loading$ = this.loadingSubject.asObservable();
        this.initSettings();
    }

    search(term: string, newSettings?: boolean) {
        if (newSettings) {
            this.initSettings();
        }
        this.settings.quizName = term;
        this.filterQuiz().pipe(first()).subscribe();
    }

    filterQuiz(page?: number): Observable<ExtendedQuizPreview[]> {
        this.filterTotalSize().pipe(first()).subscribe(n => this.currentQuizzesSizeSubject.next(n));
        return this.sendReq(this.settings, page ? page : 1);
    }

    filterTotalSize(): Observable<number> {
        const sett = this.generateSettingsForRequest(this.settings);
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
            quizLang: this.localeService.getValue('quizFilter.langAll')
        };
    }

    private sendReq(settings: QuizFilterSettings, page: number): Observable<ExtendedQuizPreview[]> {
        const sett = this.generateSettingsForRequest(settings);
        this.loadingSubject.next(true);
        return this.http.post<ExtendedQuizPreview[]>(`${this.filterUrl}/${page}`, JSON.stringify(sett),
            this.httpOptions).pipe(map(data => {
                const quizzes = data.map(x => {
                    return new ExtendedQuizPreview().deserialize(x, this.sanitizer);
                });
                this.currentQuizzesSubject.next(quizzes);
                this.loadingSubject.next(false);
                return quizzes;
            }
        ));
    }

    private generateSettingsForRequest(settings: QuizFilterSettings) {
        return {
            quizName: settings.quizName && settings.quizName.length > 0 ? settings.quizName : null,
            userName: settings.userName && settings.userName.length > 0 ? settings.userName : null,
            moreThanRating: settings.moreThanRating,
            lessThanRating: settings.lessThanRating,
            orderByRating: settings.orderByRating,
            tags: settings.tags.length > 0 ? settings.tags.map(x => x.id) : null,
            categories: settings.categories.length > 0 ? settings.categories.map(x => x.id) : null,
            quizLang: settings.quizLang === this.localeService.getValue('quizFilter.langAll') ?
                null : this.languageEditor(settings.quizLang)
        };
    }

    private languageEditor(lang: string) {
        switch (lang) {
            case this.localeService.getValue('utils.langEng'):
                return 'eng';
            case this.localeService.getValue('utils.langUkr'):
                return 'ukr';
            default:
                return lang;
        }
    }
}
