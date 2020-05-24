import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { QuizValidationService } from '../../core/_services/quiz/quiz-validation.service';
import { Observable } from 'rxjs';
import { ExtendedQuiz } from '../../core/_models/extended-quiz';
import { ExtendedQuestion } from '../../core/_models/question/extendedquestion';
import { ModalService } from '../../core/_services/utils/modal.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';

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
              public toastsService: ToastsService,
              private localeService: LocaleService
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
    this.modalService.openModal(this.localeService.getValue('modal.reject'), 'danger')
    .subscribe((receivedEntry) => {
      if (receivedEntry) {
        this.quizValidationService.validateQuiz(id,false,this.adminComment,null,null)
          .subscribe(next => {
            this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.rejected'));
            this.router.navigateByUrl('/validation');      
          },
            error => {
              this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));
          });
      }
    });
  }

  accept(id: string):void{
    this.modalService.openModal(this.localeService.getValue('modal.acceptQuiz'), 'success')
    .subscribe((receivedEntry) => {
      if (receivedEntry) {
        this.quizValidationService.validateQuiz(id,true,this.adminComment,this.quiz.creatorId,this.quiz.title)
          .subscribe(next => {
            this.toastsService.toastAddSuccess(this.localeService.getValue('toasterEditor.acceptedActivated'));
            this.router.navigateByUrl('/validation');      
          },
            error => {
              this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
              this.router.navigateByUrl('/validation');      
          });
      }
    });
  }
}
