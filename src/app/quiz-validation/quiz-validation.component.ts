import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { QuizValidationService } from '../_services/quiz-validation.service';
import { Observable } from 'rxjs';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { DomSanitizer } from '@angular/platform-browser';
import { ExtendedQuestion } from '../_models/question/extendedquestion';
import { ModalService } from '../_services/modal.service';
import { ToastsService } from '../_services/toasts.service';

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
  adminComment: string;

  totalQuestionsListSize$: Observable<number>;
  questionList$: Observable<ExtendedQuestion[]>;

  quiz: ExtendedQuiz;
  
  constructor(private route: ActivatedRoute,
              private quizValidationService: QuizValidationService,
              public modalService: ModalService,
              private router: Router,
              public toastsService: ToastsService
              ){
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
  
  
  reject(id: string):void{
    this.modalService.openModal("Are you sure you want to reject this quiz?", 'danger')
    .subscribe((receivedEntry) => {
      if (receivedEntry) {
        this.quizValidationService.validateQuiz(id,false,this.adminComment,null,null)
          .subscribe(next => {
            this.toastsService.toastAddWarning("The quiz was successfully rejected");
            this.router.navigateByUrl('/validation');      
          },
            error => {
              this.toastsService.toastAddWarning("Something went wrong with the processing of rejection");
          });
      }
    });
  }

  accept(id: string):void{
    this.modalService.openModal("Are you sure you want to accept this quiz?", 'success')
    .subscribe((receivedEntry) => {
      if (receivedEntry) {
        this.quizValidationService.validateQuiz(id,true,this.adminComment,this.quiz.creatorId,this.quiz.title)
          .subscribe(next => {
            this.toastsService.toastAddSuccess("The quiz was successfully accepted!");
            this.router.navigateByUrl('/validation');      
          },
            error => {
              this.toastsService.toastAddDanger("Something went wrong while processing the acception.");
              this.router.navigateByUrl('/validation');      
          });
      }
    });
  }
}
