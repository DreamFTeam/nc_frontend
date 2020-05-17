import { Component, OnInit, Input, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizValidationPreview } from 'src/app/_models/quiz-validation-preview';
import { QuizValidationListService } from 'src/app/_services/quiz-validation-list.service';
import { Router } from '@angular/router';
import { QuizValidationService } from 'src/app/_services/quiz-validation.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {YesNoModalComponent} from '../../yes-no-modal/yes-no-modal.component';


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
              private modalService: NgbModal) { }

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
    this.router.navigateByUrl('/validation/' + id);
  }

  reject(id: string):void{
    this.openModal("Are you sure you want to reject this quiz?", 'warning')
    .subscribe((receivedEntry) => {
      if (receivedEntry) {
        this.quizValidationService.validateQuiz(id,false,"This quiz was instantly rejected without validation",null,null)
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
          };
        });
  }

  openModal(text, style): any{
    const modalRef = this.modalService.open(YesNoModalComponent);
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.style =style;

    return modalRef.componentInstance.passEntry;
  }
}

export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) {}
}