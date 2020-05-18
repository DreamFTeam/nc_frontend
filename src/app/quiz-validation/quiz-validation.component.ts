import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { QuizValidationService } from '../_services/quiz-validation.service';
import { Quiz } from '../_models/quiz';
import { Observable } from 'rxjs';
import { Question } from '../_models/question/question';
import { OneToFour } from '../_models/question/onetofour';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { DomSanitizer } from '@angular/platform-browser';
import { ExtendedQuestion } from '../_models/question/extendedquestion';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
              private location: Location,
              private sanitizer: DomSanitizer,
              private quizValidationService: QuizValidationService,
              private _modalService: NgbModal,
              private router: Router
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
    this._modalService.open(MODALS['autofocus']).result.then((result) => {
      if(result === "Ok"){
        this.quizValidationService.validateQuiz(id,false,this.adminComment,null,null)
          .subscribe(next => {
            alert("The quiz was rejected successfully");
            this.router.navigateByUrl('/validation');      
          },
            error => {
              alert("Something went wrong with the rejection: "+ 
                error.message);
              this.router.navigateByUrl('/validation');
          });
      }
    }, (reason) => {});
  }


  
  accept(id: string):void{
    this.quizValidationService.validateQuiz(id,true,this.adminComment,this.quiz.creatorId,this.quiz.title)
          .subscribe(next => {
            
        console.log(this.adminComment);
            alert("The quiz was successfully accepted");
            this.router.navigateByUrl('/validation');      
          },
            error => {
              alert("Something went wrong with accepting: "+ 
                error.message);
                this.router.navigateByUrl('/validation');      
          });
      }
}



//MODAL
@Component({
  selector: 'ngbd-modal-confirm-autofocus',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Quiz rejection</h4>
    <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to reject this quiz?</strong></p>
    <span class="text-danger">This operation can not be undone.</span>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" ngbAutofocus class="btn btn-danger" (click)="modal.close('Ok')">Ok</button>
  </div>
  `
})
export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) {}
}


const MODALS: {[name: string]: Type<any>} = {
  autofocus: NgbdModalConfirmAutofocus
};