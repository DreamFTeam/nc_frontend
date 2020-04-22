import { Component, OnInit } from '@angular/core';
import { Quiz } from '../_models/quiz';
import { Question } from '../_models/question/question';
import { OneToFour } from '../_models/question/onetofour';
import { TrueFalse } from '../_models/question/truefalse';
import { OpenAnswer } from '../_models/question/openanswer';
import { SequenceAnswer } from '../_models/question/sequenceanswer';
import { QuizService } from '../_services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  lockedButtons: boolean = true;
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
  questions: Question[];
  question: Question = new OneToFour("","","","",0,this.quiz.id,1,["",""],[false,false]);

  constructor(private quizService: QuizService, private activateRoute: ActivatedRoute, private router: Router) { 
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('id')))
     .subscribe(data => 
      this.quizService.getQuiz(data).subscribe(ans => this.mapGettedQuiz(ans),
       err => this.getEditQuizErr(err))); 
  }

  ngOnInit(): void {
    
  }


  //Save(create) quiz button
  createQuiz(){
    //TODO: validation
    let error;
    let answer;
    console.log(this.quiz);
    this.quizService.createQuiz(this.quiz).subscribe(ans =>this.mapCreatedQuiz(ans),err => this.getCreatedErr(err));
  }


  //Get id of created quiz
  mapCreatedQuiz(ans){
    this.quiz.id = ans.id;
    console.log(this.quiz);
    this.router.navigate(['/quiz/'+this.quiz.id]);
  }


  //Gettig quiz by id in url
  mapGettedQuiz(answer){
    this.quiz.id=answer.id;
    this.quiz.title=answer.title;
    this.quiz.description=answer.description;
    this.quiz.imageReference=answer.imageRef;
    this.quiz.quizLanguage=answer.language;
    //TODO: map tags and categs
    this.lockedButtons=false;
    
  }

  //Created quiz error
  getCreatedErr(err){
    alert("Quiz cannot be created: "+err.error.message);
  }

  //Cannot get quiz or id is empty
  getEditQuizErr(err){
    this.lockedButtons=false;
  }

  saveQuestion() {
      
  }

  public publish() {
    if(this.questions.length > 0) {
      //TODO: publish with service
    }
  }

  onChange(deviceValue) {
    console.log(deviceValue);
    

    switch(deviceValue) { 
      case "1": { 
         this.question = new OneToFour("","","","",0,this.quiz.id,1,["",""],[]);
         break; 
      } 
      case "2": { 
         this.question = new TrueFalse("","","","",0,this.quiz.id,1,"False","True");
         break; 
      } 
      case "3": {
         this.question = new OpenAnswer("","","","",0,this.quiz.id,1,"");
         break; 
      } 
      case "4": {     
        this.question = new SequenceAnswer("","","","",0,this.quiz.id,1,["","",""]);
        break; 
     } 
   }
  }

  removeQuestion(){
  }

  uploadImage(){
    this.question.image="image";
  }

  quizImage(){
    this.quiz.imageReference="image";
  }

  isOneToFour(val) { return  val instanceof OneToFour; }
  isTrueFalse(val) { return  val instanceof TrueFalse; }
  isOpenAnswer(val) { return  val instanceof OpenAnswer; }
  isSequenceAnswer(val) { return  val instanceof SequenceAnswer; }
  isQuizCreated(){ return this.quiz.id !== ""; }
  isButtonLocked(){
    return !this.isQuizCreated() && this.lockedButtons;
  }

}
