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
  currentQuizId: string;
  mockImageUrl = "../../assets/img/quiz.jpg";
  page: number;
  pageSize: number;

  totalQuestionsListSize$: Observable<number>;
  questionList$: Observable<ExtendedQuestion[]>;

  quiz: ExtendedQuiz;
  
  constructor(private route: ActivatedRoute,
              private location: Location,
              private sanitizer: DomSanitizer,
              private quizValidationService: QuizValidationService){
      this.pageSize = PAGE_SIZE;
      this.page = 1;
      this.currentQuizId = this.route.snapshot.paramMap.get('id');  
      this.quiz = new ExtendedQuiz();
    }

  ngOnInit(): void {
    this.getTotalQuestionListSize();
    this.getQuestionListByPage(this.page);
    this.getQuizToValidate();
  }

  getQuestionListByPage(p: number):void{
    this.questionList$ = this.quizValidationService.getQuestionListByPage(this.currentQuizId, p);
  }

  getQuizToValidate(): void{
    this.quizValidationService.getQuizToValidate(this.currentQuizId)
      .subscribe(quizData => this.quiz = quizData);
  }

  getTotalQuestionListSize(): void{
    this.totalQuestionsListSize$ = this.quizValidationService.getTotalQuestionsListSize(this.currentQuizId);
  }

  loadPage(event): void{
    this.getQuestionListByPage(event);
  }

  isSequenceQuestion(type: number): boolean{
    return type === 4;
  }
  isOptionsAnswer(type: number): boolean{
    return type === 1;
  }
  isOneValQuestion(type: number): boolean{
    return type === 3 || type === 2;
  }
  

}
