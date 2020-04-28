import { Component, OnInit, Input } from '@angular/core';
import { OneToFour } from '../_models/question/onetofour';

@Component({
  selector: 'app-one-of-four',
  templateUrl: './one-of-four.component.html',
  styleUrls: ['./one-of-four.component.css']
})
export class OneOfFourComponent implements OnInit {
  @Input() question: OneToFour;

  constructor() {
  }

  ngOnInit(): void {
  }

  addAnswer(){
    this.question.answers.push("");
    this.question.rightAnswers.push(false);
  }

  removeAnswer(i){
    this.question.answers.splice(i,1);
    this.question.rightAnswers.splice(i,1);
  }

  isLimitReached(){
    return this.question.answers.length!=4;
  }

  isRemovable(){
    return this.question.answers.length>2;
  }

  trackByFn(index: any, item: any) {
    return index;
   } 

   onChange(event, answer){
    console.log(event+" "+answer);
   }

}
