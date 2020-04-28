import {Observable} from "rxjs";
import { Component, OnInit } from '@angular/core';
import { QuizPreview } from '../_models/quiz-preview';
import { QuizListService } from '../_services/quiz-list.service';


const PAGE_SIZE: number = 16;

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  page: number;
  pageSize: number;

  totalSize$: Observable<number>;
  quizList$: Observable<QuizPreview[]>;

  constructor( private quizListService: QuizListService) { 
    this.pageSize = PAGE_SIZE;
  }

  ngOnInit(): void {
    this.page = 1;
    this.getTotalSize();
    this.getQuizzes(this.page);
  }

  getQuizzes(p:number): void{
    this.quizList$ = this.quizListService.getQuizzesByPage(p);
  }

  getTotalSize(): void{
    this.totalSize$ = this.quizListService.getTotalSize();
    this.totalSize$.subscribe(ans => console.log(ans));
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
