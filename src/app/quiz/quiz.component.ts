import { Component, OnInit } from '@angular/core';
import { Question } from '../_models/question/question';
import { OneToFour } from '../_models/question/onetofour';
import { TrueFalse } from '../_models/question/truefalse';
import { OpenAnswer } from '../_models/question/openanswer';
import { SequenceAnswer } from '../_models/question/sequenceanswer';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  counter: number = 0;
  name: string;
  category: string;
  tags: string;
  description: string;
  questions: Question[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public add() {
    this.questions.push(new OneToFour( this.counter++,"",[],[]));
  }

  public publish() {
    alert('publish');
  }

  onChange(deviceValue, id) {
    console.log(deviceValue);
    

    switch(deviceValue) { 
      case "1": { 
        this.questions.splice(id,1,new OneToFour(id,"",[],[]));
         break; 
      } 
      case "2": { 
        this.questions.splice(id,1,new TrueFalse(id,"",false));
         break; 
      } 
      case "3": {
        this.questions.splice(id,1,new OpenAnswer(id,"","")); 
         break; 
      } 
      case "4": { 
        this.questions.splice(id,1,new SequenceAnswer(id,"",[]));
        break; 
     } 
   }
  }

  isOneToFour(val) { return  val instanceof OneToFour; }
  isTrueFalse(val) { return  val instanceof TrueFalse; }
  isOpenAnswer(val) { return  val instanceof OpenAnswer; }
  isSequenceAnswer(val) { return  val instanceof SequenceAnswer; }

}
