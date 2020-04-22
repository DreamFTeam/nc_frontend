import { Component, OnInit, Input } from '@angular/core';
import { TrueFalse } from '../_models/question/truefalse';

@Component({
  selector: 'app-true-false',
  templateUrl: './true-false.component.html',
  styleUrls: ['./true-false.component.css']
})
export class TrueFalseComponent implements OnInit {
  @Input() question: TrueFalse;

  constructor() { }

  ngOnInit(): void {
  }

  onChange(deviceValue) {
    if(deviceValue === "0"){
      this.question.rightAnswer = "false";
      this.question.answer = "true";
      
    }else{
      this.question.rightAnswer = "true";
      this.question.answer = "false";
    }
  }

}
