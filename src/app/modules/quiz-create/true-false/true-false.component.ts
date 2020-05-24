import { Component, OnInit, Input } from '@angular/core';
import { ExtendedQuestion } from '../../core/_models/question/extendedquestion';

@Component({
  selector: 'app-true-false',
  templateUrl: './true-false.component.html',
  styleUrls: ['./true-false.component.css']
})
export class TrueFalseComponent implements OnInit {
  @Input() question: ExtendedQuestion;

  @Input()
  available: boolean;

  constructor() {
    
   }

  ngOnInit(): void {
  }

  onChange(deviceValue) {
    if(this.question.rightOptions[0] === "true"){
      this.question.otherOptions[0]= "false";
    }
    else{
      this.question.otherOptions[0]= "true";
    }
  }

}
