import {Component, OnInit} from '@angular/core';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, first, map} from 'rxjs/operators';
import {SearchFilterQuizService} from '../../core/_services/quiz/search-filter-quiz.service';
import {Tag} from '../../core/_models/tag';
import {Category} from '../../core/_models/category';
import {QuizFilterSettings} from '../../core/_models/quiz-filter-settings';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TagCatg} from '../../core/_models/tagcateg';
import {QuizService} from '../../core/_services/quiz/quiz.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-quiz-filter',
    templateUrl: './quiz-filter.component.html',
    styleUrls: ['./quiz-filter.component.css']
})
export class QuizFilterComponent implements OnInit {

    readonly RESULTS_SEARCH_AMOUNT = '5';
    readonly rating = ['0', '1', '2', '3', '4', '5'];
    readonly languages = [this.translateService.instant('quizFilter.langAll'),
        this.translateService.instant('utils.langEng'),
        this.translateService.instant('utils.langUkr')
    ];
    tags: Tag[] = [];
    categories: Category[] = [];

    focusCat$ = new Subject<string>();
    clickCat$ = new Subject<string>();
    focusTag$ = new Subject<string>();
    clickTag$ = new Subject<string>();

    newTag: Tag;
    newCateg: Category;
    settings: QuizFilterSettings;

    constructor(private searchFilterQuizService: SearchFilterQuizService,
                private activeModal: NgbActiveModal,
                private quizService: QuizService,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        if (!this.searchFilterQuizService.getSettings().quizLang) {
            this.searchFilterQuizService.initSettings();
        }
        this.settings = this.searchFilterQuizService.getSettings();
        this.quizService.getTagsList().subscribe(next => this.tags = next);
        this.quizService.getCategoriesList().subscribe(next => this.categories = next);
    }

    formatter = (tagCat: TagCatg) => tagCat.description;

    searchTag = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const inputFocus$ = this.focusTag$;

        return merge(debouncedText$, inputFocus$).pipe(
            map(term => (term === '' ? this.tags
                : this.tags.filter(x => x.description.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
        );
    };

    searchCat = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const inputFocus$ = this.focusCat$;

        return merge(debouncedText$, inputFocus$).pipe(
            map(term => (term === '' ? this.categories
                : this.categories.filter(x => x.description.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
        );
    };


    deleteTag(id: string) {
        this.settings.tags = this.settings.tags.filter(x => x.id !== id);
    }

    deleteCategor(id: string) {
        this.settings.categories = this.settings.categories.filter(x => x.id !== id);
    }

    addCateg() {
        if (this.newCateg && !this.settings.categories.map(x => x.id).includes(this.newCateg.id)) {
            this.settings.categories.push(this.newCateg);
            this.newCateg = null;
        }
    }

    addTag() {
        if (this.newTag && !this.settings.tags.map(x => x.id).includes(this.newTag.id)) {
            this.settings.tags.push(this.newTag);
            this.newTag = null;
        }
    }

    filter() {
        this.activeModal.close();
        this.searchFilterQuizService.setSettings(this.settings);
        this.searchFilterQuizService.filterQuiz().pipe(first()).subscribe();
    }
}
