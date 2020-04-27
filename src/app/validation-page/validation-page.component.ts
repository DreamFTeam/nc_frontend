import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizValidationPreview } from '../_models/quiz-validation-preview';
import { QuizValidationListService} from '../_services/quiz-validation-list.service';

@Component({
  selector: 'app-validation-page',
  templateUrl: './validation-page.component.html',
  styleUrls: ['./validation-page.component.css']
})
export class ValidationPageComponent implements OnInit {
  active: number;
  currentUsername: string;

  constructor(private quizValidationService: QuizValidationListService) {
    this.active = 1;
  }

  ngOnInit(): void {
    this.currentUsername = this.quizValidationService.getCurrentUsername();
  }

  changeList(event):void{
    this.quizValidationService.listType = event;
  }

}
