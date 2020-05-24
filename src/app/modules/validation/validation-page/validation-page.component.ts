import { Component, OnInit } from '@angular/core';
import { QuizValidationListService} from '../../core/_services/quiz-validation-list.service';

@Component({
  selector: 'app-validation-page',
  templateUrl: './validation-page.component.html',
  styleUrls: ['./validation-page.component.css']
})
export class ValidationPageComponent implements OnInit {
  //active tab id
  active: number;

  currentUsername: string;
  
  //True, when type of list is Unvalidated
  showButtons: boolean = true;

  constructor(private quizValidationService: QuizValidationListService) {
    this.active = quizValidationService.listType;
  }

  ngOnInit(): void {
    this.currentUsername = this.quizValidationService.getCurrentUsername();
  }

  changeList(event):void{
    if (event == 1){
      this.showButtons = true;
    }
    else{
      this.showButtons = false;
    }
    this.quizValidationService.listType = event;
  }

}
