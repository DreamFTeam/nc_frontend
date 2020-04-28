import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizValidationPreview } from 'src/app/_models/quiz-validation-preview';
import { QuizValidationListService } from 'src/app/_services/quiz-validation-list.service';

//Pagination: number of items per page
const PAGE_SIZE: number = 6;

@Component({
  selector: 'app-validation-tab',
  templateUrl: './validation-tab.component.html',
  styleUrls: ['./validation-tab.component.css']
})
export class ValidationTabComponent implements OnInit {
  mockImageUrl:string = "../../assets/img/quiz.jpg";
  pageSize:number = PAGE_SIZE;
  page: number;
  totalSize$: Observable<number>;
  quizList$: Observable<QuizValidationPreview[]>;

  constructor(private quizValidationListService: QuizValidationListService) { }

  ngOnInit(): void {
    this.page = 1;
    this.getTotalSize();
    this.getQuizList(this.page);
  }

  getTotalSize(): void{
    this.totalSize$ = this.quizValidationListService.getTotalSize();
  }

  getQuizList(page): void{
    this.quizList$ = this.quizValidationListService.getQuizListByPage(page);
  }

  loadPage(event):void{
    this.getQuizList(event);
  }
}
