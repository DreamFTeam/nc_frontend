import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { QuizValidationService } from '../_services/quiz-validation.service';
import { Quiz } from '../_models/quiz';
import { Observable } from 'rxjs';
import { Question } from '../_models/question/question';
import { OneToFour } from '../_models/question/onetofour';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { DomSanitizer } from '@angular/platform-browser';
import { ExtendedQuestion } from '../_models/question/extendedquestion';


const PAGE_SIZE: number = 3;

@Component({
  selector: 'app-quiz-validation',
  templateUrl: './quiz-validation.component.html',
  styleUrls: ['./quiz-validation.component.css']
})
export class QuizValidationComponent implements OnInit {
  private currentQuizId: string;
  
  private page: number;
  private pageSize: number;

  private totalQuestionsListSize$: Observable<number>;
  private questions$: Observable<ExtendedQuestion[]>;

  private quiz$: Observable<ExtendedQuiz>;
  
  //MOCK
  quiz: ExtendedQuiz;


  constructor(private route: ActivatedRoute,
              private location: Location,
              private sanitizer: DomSanitizer,
              private quizValidationService: QuizValidationService){
      this.pageSize = PAGE_SIZE;
      this.page = 1;
      let mock = {
          id: "this is a quiz id",
          title: "This is a title of a quiz This is a title of a quiz This is a title of a quiz This is a title of a quiz",
          description: "description",
          categoryIdList: ["3b338765-c75d-40e2-9ab0-789738acd07a"],
          categoryNameList: ["Historical"],
          tagsIdList: ["c03a2080-d447-4bde-be2e-6f22c6ebee63"],
          tagNameList: ["This Is a tag"],
          creationDate: new Date(),
          creatorId: "",
          author: "",
          language: "eng",
          adminComment: "",
          rating: 0,
          published: false,
          activated: false,
          validated: false,
          isFavourite: false,
          imageContent: "",
        }
        this.quiz = new ExtendedQuiz().deserialize(mock,sanitizer);
  }

  ngOnInit(): void {
    this.currentQuizId = this.route.snapshot.paramMap.get('id');
    this.getQuizToValidate();
    this.getTotalQuestionListSize();
    this.getQuestionListByPage(this.page);
    //this.getQuizToValidate();
  }

  getQuestionListByPage(p: number):void{
    this.questions$ = this.quizValidationService.getQuestionListByPage(this.currentQuizId, p);
  }

  getQuizToValidate(): void{
    this.quiz$ = this.quizValidationService.getQuizToValidate(this.currentQuizId);
  }

  getTotalQuestionListSize(): void{
    this.totalQuestionsListSize$ = this.quizValidationService.getTotalQuestionsListSize(this.currentQuizId);
  }



  loadPage(event): void{

  }

}
