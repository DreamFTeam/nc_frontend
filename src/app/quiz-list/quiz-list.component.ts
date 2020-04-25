import { Component, OnInit } from '@angular/core';
import { QuizPreview } from '../_models/quiz-preview';
import { QUIZZES } from './fakequiz';
import { QuizListService } from '../_services/quiz-list.service';

const PAGE_SIZE: number = 16;

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  config:any;
  page: number;
  pageSize: number;
  totalSize: number;

  fakeQuizList: QuizPreview[] = QUIZZES;
  quizList: QuizPreview[];

  constructor( private quizListService: QuizListService) { 
    this.pageSize = PAGE_SIZE;
  }

  ngOnInit(): void {
    this.page = 1;
    this.getTotalSize();
    this.getQuizzes(this.page);
  }

  getQuizzes(p:number): void{
    this.quizListService.getQuizzesByPage(p)
      .subscribe(list => this.quizList = list);
  }

  getTotalSize(): void{
    this.quizListService.getTotalSize()
      .subscribe(size => this.totalSize = size);
  }

  loadPage(event){
    this.getQuizzes(event);
    this.scrollToTop();
  }

  scrollToTop(){
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 40);
      } else {
          window.clearInterval(scrollToTop);
      }
    }, 16);
  }
}
