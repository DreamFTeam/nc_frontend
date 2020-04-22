import { Component, OnInit } from '@angular/core';
import { Quiz } from '../_models/quiz';
import { Question } from '../_models/question/question';
import { OneToFour } from '../_models/question/onetofour';
import { TrueFalse } from '../_models/question/truefalse';
import { OpenAnswer } from '../_models/question/openanswer';
import { SequenceAnswer } from '../_models/question/sequenceanswer';
import { QuizService } from '../_services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  counter: number = 0;
  quiz: Quiz = {
    id: "",
    title: "",
    category: ["3b338765-c75d-40e2-9ab0-789738acd07a"],
    tags: ["c03a2080-d447-4bde-be2e-6f22c6ebee63"],
    description: "",
    imageReference: "",
    creationDate: new Date(),
    creatorId: "",
    activated: false,
    validated: false,
    quizLanguage: "eng",
    adminCommentary: "",
    rating: 0,
    published: false,

  };
  questions: Question[] = [];

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {}

  public createQuiz(){
    //TODO: validation

    console.log(this.quiz);
    this.quizService.createQuiz(this.quiz);
  }

  public add() {
      //this.questions.push(new OneToFour( this.counter++,"",[],[]));
  }

  public publish() {
    alert('publish');
  }

  onChange(deviceValue, id) {
    console.log(deviceValue);
    

    switch(deviceValue) { 
      case "1": { 
       // this.questions.splice(id,1,new OneToFour(id,"",[],[]));
         break; 
      } 
      case "2": { 
      //  this.questions.splice(id,1,new TrueFalse(id,"",false));
         break; 
      } 
      case "3": {
      //  this.questions.splice(id,1,new OpenAnswer(id,"","")); 
         break; 
      } 
      case "4": { 
       // this.questions.splice(id,1,new SequenceAnswer(id,"",[]));
        break; 
     } 
   }
  }

  removeQuestion(id){
    this.questions.splice(id,1);
  }

  uploadImage(id){
    this.questions[id].image="image";
    console.log(this.questions[id]);
  }

  quizImage(){
    this.quiz.imageReference="image";
  }

  isOneToFour(val) { return  val instanceof OneToFour; }
  isTrueFalse(val) { return  val instanceof TrueFalse; }
  isOpenAnswer(val) { return  val instanceof OpenAnswer; }
  isSequenceAnswer(val) { return  val instanceof SequenceAnswer; }
  canIAddMore(){ return this.counter < 20; }

}
