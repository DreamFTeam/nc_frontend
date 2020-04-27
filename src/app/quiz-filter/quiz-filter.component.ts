import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {SearchFilterQuizService} from '../_services/search-filter-quiz.service';

interface Tags {
  id: string;
  description: string;
}

interface Categories {
  id: string;
  title: string;
}

@Component({
  selector: 'app-quiz-filter',
  templateUrl: './quiz-filter.component.html',
  styleUrls: ['./quiz-filter.component.css']
})
export class QuizFilterComponent implements OnInit {
  userName: string;
  @Input() quizName: string;
  tags: Tags[] = [];
  categories: Categories[] = [];
  newTag: Tags;
  newCateg: Categories;
  ratingOrder: boolean;
  tagInput: string;

  rating = ['0', '1', '2', '3', '4', '5'];
  minRating = '0';
  maxRating = '5';

  tempCat = [
    {id: 'red', title: 'red'},
    {id: 'blue', title: 'blue'},
    {id: 'blue2', title: 'blue2'},
    {id: 'blue3', title: 'blue3'},
    {id: 'blue4', title: 'blue5'},
    {id: 'white', title: 'whjdsifjdiojite'},
    {id: 'black', title: 'black'}
  ];
  tempTags = [
    {id: 'red', description: 'red'},
    {id: 'blue', description: 'blue'},
    {id: 'red1', description: 'red1'},
    {id: 'blue1', description: 'blue1'},
    {id: 'red3', description: 'red3'},
    {id: 'blue3', description: 'blue3'},
    {id: 'white', description: 'whjdsifjdiojite'},
    {id: 'black', description: 'black'}
  ];

  constructor(private searchFilterQuizService: SearchFilterQuizService) {
  }

  ngOnInit(): void {
  }

  formatterTags = (tag: Tags) => tag.description;
  formatterCateg = (cat: Categories) => cat.title;

  searchTag = (text: Observable<string>) =>
    text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.tempTags.filter(x => x.description.includes(term)))
      // switchMap(term => term.length < 2 ? []
      //   : this.searchFilterQuizService.searchTags(term))
    );

  searchCat = (text: Observable<string>) =>
    text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.tempCat.filter(x => x.title.includes(term)))
      // switchMap(term => term.length < 2 ? []
      //   : this.searchFilterQuizService.searchCategories(term))
    );

  deleteTag(id: string) {
    this.tags = this.tags.filter(x => x.id !== id);
  }

  deleteCategor(id: string) {
    this.categories = this.categories.filter(x => x.id !== id);
  }

  addCateg() {
    if (this.newCateg && !this.categories.includes(this.newCateg)) {
      this.categories.push(this.newCateg);
      this.newCateg = null;
    }
  }

  addTag() {
    if (this.newTag && !this.tags.includes(this.newTag)) {
      this.tags.push(this.newTag);
      this.newTag = null;
    }
  }

  filter() {
    [this.quizName, this.userName, this.minRating, this.maxRating, true, this.tags.map(x => x.id), this.categories.map(x => x.id)].forEach(x => console.log(x))
    // this.searchFilterQuizService.filterQuiz(this.quizName, this.userName, this.minRating, this.maxRating, true, this.tags.map(x => x.id), this.categories.map(x => x.id));
  }
}
