import { Component, OnInit, Input } from '@angular/core';
import { SequenceAnswer } from '../_models/question/sequenceanswer';

@Component({
  selector: 'app-seq-options',
  templateUrl: './seq-options.component.html',
  styleUrls: ['./seq-options.component.css']
})
export class SeqOptionsComponent implements OnInit {
  @Input() question: SequenceAnswer;

  constructor() { }

  ngOnInit(): void {
  }

  addAnswer(){
    this.question.rightAnswers.push("");
  }

  removeAnswer(i){
    this.question.rightAnswers.splice(i,1);
  }

  isLimitReached(){
    return this.question.rightAnswers.length!=8;
  }

  isRemovable(){
    return this.question.rightAnswers.length>3;
  }

  trackByFn(index: any, item: any) {
    return index;
   } 

}
