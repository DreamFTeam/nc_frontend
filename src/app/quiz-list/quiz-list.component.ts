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
    this.config = {
        itemsPerPage: PAGE_SIZE,
        currentPage: 1,
        totalItems: 32
    }
  
  }

  getQuizzes(p:number): void{
    this.quizListService.getQuizzesByPage(p)
      .subscribe(list => this.quizList = list);
  }

  getTotalSize(): void{
    this.quizListService.getTotalSize()
      .subscribe(size => this.totalSize = size);
  }

  pageChanged(event){
      this.config.currentPage = event;
      this.getQuizzes(event);
  }

}
