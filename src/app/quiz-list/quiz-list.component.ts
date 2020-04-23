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
  
  page: number;
  pageSize: number;
  totalSize: number;

  fakeQuizList: QuizPreview[] = QUIZZES;
  quizList: QuizPreview[];

  constructor( private quizListService: QuizListService) { 
    // this.totalSize = this.quizList.length;
    this.pageSize = PAGE_SIZE;
  }

  ngOnInit(): void {
    this.page = 1;
    this.getTotalSize();
    this.getQuizzes();
  }

  getQuizzes(): void{
    this.quizListService.getQuizzesByPage(this.page)
      .subscribe(list => this.quizList = list);
  }

  getTotalSize(): void{
    this.quizListService.getTotalSize()
      .subscribe(size => this.totalSize = size);
  }

}
