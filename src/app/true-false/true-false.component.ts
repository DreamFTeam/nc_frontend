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
    if(deviceValue){
      this.question.answer = "false";
      
    }else{
      this.question.answer = "true";
    }


    console.log(this.question);
  }

}
