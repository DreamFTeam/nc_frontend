import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizValidationPreview } from 'src/app/_models/quiz-validation-preview';
import { QuizValidationListService } from 'src/app/_services/quiz-validation-list.service';
import { Router } from '@angular/router';

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
  @Input() showButtons: boolean;

  constructor(private quizValidationListService: QuizValidationListService,
              private router: Router) { }

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

  validate(id:string):void{
    this.router.navigateByUrl('/validate/' + id); //further improvement is coming...
  }

  reject(id: string):void{
    console.log("To be rejected"); //further improvement is coming...
  }
}
