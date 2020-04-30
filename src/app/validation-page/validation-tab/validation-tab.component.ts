import { Component, OnInit, Input, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizValidationPreview } from 'src/app/_models/quiz-validation-preview';
import { QuizValidationListService } from 'src/app/_services/quiz-validation-list.service';
import { Router } from '@angular/router';
import { QuizValidationService } from 'src/app/_services/quiz-validation.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

//Pagination: number of items per page
const PAGE_SIZE: number = 6;

@Component({
  selector: 'app-validation-tab',
  templateUrl: './validation-tab.component.html',
  styleUrls: ['./validation-tab.component.css']
})
export class ValidationTabComponent implements OnInit {
  mockImageUrl:string = "../../assets/img/quiz.jpg";
  pageSize:number = PAGE_SIZE;
  page: number;
  totalSize$: Observable<number>;
  quizList$: Observable<QuizValidationPreview[]>;
  @Input() showButtons: boolean;

  constructor(private quizValidationListService: QuizValidationListService,
              private quizValidationService: QuizValidationService,
              private router: Router,
              private _modalService: NgbModal) { }

  ngOnInit(): void {
    this.page = 1;
    this.getTotalSize();
    this.getQuizList(this.page);
  }

  getTotalSize(): void{
    this.totalSize$ = this.quizValidationListService.getTotalSize();
  }

  getQuizList(page): void{
    this.quizList$ = this.quizValidationListService.getQuizListByPage(page);
  }

  loadPage(event):void{
    this.getQuizList(event);
  }

  validate(id:string):void{
    this.router.navigateByUrl('/validation/' + id); //further improvement is coming...
  }

  reject(id: string):void{
    this._modalService.open(MODALS['autofocus']).result.then((result) => {
      if(result === "Ok"){
        this.quizValidationService.validateQuiz(id,false,"")
          .subscribe(next => {
            alert("The quiz was rejected successfully");
            this.page = 1;
            this.getTotalSize();
            this.getQuizList(this.page);        
          },
            error => {
              alert("Something went wrong with the rejection: "+ 
                error.message);
            });
      }
    }, (reason) => {});
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