import { Component, OnInit, Input } from '@angular/core';
import { SequenceAnswer } from '../_models/question/sequenceanswer';
import { ExtendedQuestion } from '../_models/question/extendedquestion';

@Component({
  selector: 'app-seq-options',
  templateUrl: './seq-options.component.html',
  styleUrls: ['./seq-options.component.css']
})
export class SeqOptionsComponent implements OnInit {
  @Input() question: ExtendedQuestion;

  constructor() { }

  ngOnInit(): void {
  }

  addAnswer(){
    this.question.rightOptions.push("");
  }

  removeAnswer(i){
    this.question.rightOptions.splice(i,1);
  }

  isLimitReached(){
    return this.question.rightOptions.length!=8;
  }

  isRemovable(){
    return this.question.rightOptions.length>3;
  }

  trackByFn(index: any, item: any) {
    return index;
   } 

}
