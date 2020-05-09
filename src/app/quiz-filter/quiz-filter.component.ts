import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {QuizFilterSettings, SearchFilterQuizService} from '../_services/search-filter-quiz.service';
import {Tag} from '../_models/tag';
import {Category} from '../_models/category';


@Component({
  selector: 'app-quiz-filter',
  templateUrl: './quiz-filter.component.html',
  styleUrls: ['./quiz-filter.component.css']
})
export class QuizFilterComponent implements OnInit {
  newTag: Tag;
  newCateg: Category;
  settings: QuizFilterSettings;
  readonly RESULTS_SEARCH_AMOUNT = '5';

  rating = ['0', '1', '2', '3', '4', '5'];
  constructor(private searchFilterQuizService: SearchFilterQuizService) {
  }

  ngOnInit(): void {
    if (!this.searchFilterQuizService.getSettings()) {
      this.searchFilterQuizService.saveSettings({
        quizName: null,
        userName: null,
        categories: [],
        tags: [],
        orderByRating: true,
        lessThanRating: '5',
        moreThanRating: '0'
      });
    }
    this.settings = this.searchFilterQuizService.getSettings();
  }

  formatterTags = (tag: Tag) => tag.description;
  formatterCateg = (cat: Category) => cat.title;

  searchTag = (text: Observable<string>) =>
    text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      // map(term => term.length < 2 ? []
      //   : this.tempTags.filter(x => x.description.includes(term)))
      switchMap(term => term.length < 2 ? []
        : this.searchFilterQuizService.searchTags(term, this.RESULTS_SEARCH_AMOUNT))
    );

  searchCat = (text: Observable<string>) =>
    text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      // map(term => term.length < 2 ? []
      //   : this.tempCat.filter(x => x.title.includes(term)))
      switchMap(term => term.length < 2 ? []
        : this.searchFilterQuizService.searchCategories(term, this.RESULTS_SEARCH_AMOUNT))
    );

  deleteTag(id: string) {
    this.settings.tags = this.settings.tags.filter(x => x.tag_id !== id);
  }

  deleteCategor(id: string) {
    this.settings.categories = this.settings.categories.filter(x => x.category_id !== id);
  }

  addCateg() {
    if (this.newCateg && !this.settings.categories.map(x => x.category_id).includes(this.newCateg.category_id)) {
      this.settings.categories.push(this.newCateg);
      this.newCateg = null;
    }
  }

  addTag() {
    if (this.newTag && !this.settings.tags.map(x => x.tag_id).includes(this.newTag.tag_id)) {
      this.settings.tags.push(this.newTag);
      this.newTag = null;
    }
  }

  filter() {
    this.searchFilterQuizService.saveSettings(this.settings);
    this.searchFilterQuizService.filterQuiz().subscribe()
  }
}
