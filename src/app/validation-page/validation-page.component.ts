import { Component, OnInit } from '@angular/core';
import { QuizValidationService } from '../_services/quiz-validation.service';

@Component({
  selector: 'app-validation-page',
  templateUrl: './validation-page.component.html',
  styleUrls: ['./validation-page.component.css']
})
export class ValidationPageComponent implements OnInit {

  page: number;
  pageSize: number;

  //totalSize$: Observable<number>;
  //quizList$: Observable<QuizPreview[]>;

  constructor(private quizValidationService: QuizValidationService) {

   }

  ngOnInit(): void {
  
  }

}
