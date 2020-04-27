import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizValidationService } from '../_services/quiz-validation.service';
import { Quiz } from '../_models/quiz';
import { Observable } from 'rxjs';
import { Question } from '../_models/question/question';
import { OneToFour } from '../_models/question/onetofour';
import { ExtendedQuiz } from '../_models/extended-quiz';

@Component({
  selector: 'app-quiz-validation',
  templateUrl: './quiz-validation.component.html',
  styleUrls: ['./quiz-validation.component.css']
})
export class QuizValidationComponent implements OnInit {
  private quiz$: Observable<Quiz>;
  // private quiz: ExtendedQuiz;
  // quiz: ExtendedQuiz = {
  //   id: "this is a quiz id",
  //   title: "This is a title of a quiz",
  //   description: "description",
  //   categoryIdList: ["3b338765-c75d-40e2-9ab0-789738acd07a"],
  //   categoryNameList: ["Historical"],
  //   tagsIdList: ["c03a2080-d447-4bde-be2e-6f22c6ebee63"],
  //   tagNameList: ["This Is a tag"],
  //   creationDate: new Date(),
  //   creatorId: "",
  //   author: "",
  //   language: "eng",
  //   adminComment: "",
  //   rating: 0,
  //   published: false,
  //   activated: false,
  //   validated: false,
  //   isFavourite: false,
  //   imageContent: "",
  // };
//  questions: Question[] = [];
//  question: Question = new OneToFour("","","","",0,this.quiz.id,1,["",""],[false,false]);


  constructor(private route: ActivatedRoute,
              private quizValidationService: QuizValidationService,
              private location: Location) {
  }

  ngOnInit(): void {
    //this.quiz = new ExtendedQuiz().deserialize();  
    //this.getQuizToValidate();
  }

  getQuizToValidate(): void{
    const id = this.route.snapshot.paramMap.get('id');
    this.quiz$ = this.quizValidationService.getQuizToValidate(id);

  }

}
