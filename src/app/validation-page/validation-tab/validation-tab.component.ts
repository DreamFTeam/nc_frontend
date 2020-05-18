import { Component, OnInit, Input, Type, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizValidationPreview } from 'src/app/_models/quiz-validation-preview';
import { QuizValidationListService } from 'src/app/_services/quiz-validation-list.service';
import { Router } from '@angular/router';
import { QuizValidationService } from 'src/app/_services/quiz-validation.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {YesNoModalComponent} from '../../yes-no-modal/yes-no-modal.component';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-validation-tab',
  templateUrl: './validation-tab.component.html',
  styleUrls: ['./validation-tab.component.css']
})
export class ValidationTabComponent implements OnInit {
  //Pagination: number of items per page
  pageSize:number = 6;

  //src of mock image
  mockImageUrl:string = "../../assets/img/quiz.jpg";
  //Async - total size of quiz list. Used for pagination.
  totalSize$: Observable<number>;
  quizList$: Observable<QuizValidationPreview[]>;
  page: number;
  @Input() showButtons: boolean;
  faSpinner = faSpinner;
  isLoading: boolean;
  //Used to show message about empty list
  //Must use it because using length in condition doesn't work properly
  isEmpty: boolean;

  toasts: any[];

  constructor(private quizValidationListService: QuizValidationListService,
              private quizValidationService: QuizValidationService,
              private router: Router,
              private modalService: NgbModal) { 
                this.isLoading = true;
                this.isEmpty = false;
                this.toasts = [];
              }

  ngOnInit(): void {
    this.page = 1;
    this.getTotalSize();
    this.getQuizList(this.page);
  }

  getTotalSize(): void{
    this.totalSize$ = this.quizValidationListService.getTotalSize();
    this.totalSize$.subscribe(val => {
      this.isLoading = false;
    },
    error => {
      this.toastAdd('An error occured while fetching the total size of a list.',
       { classname: 'bg-danger text-light' });
    });
  }

  getQuizList(page): void{
    this.quizList$ = this.quizValidationListService.getQuizListByPage(page);
    this.quizList$.subscribe(val => {
      if(val.length == 0){
        this.isEmpty = true;
      }
    },error => {
      this.toastAdd('An error occured while fetching the list of quizzes.',
       { classname: 'bg-danger text-light' });
    });
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
            this.toastAdd('The quiz was rejected successfully.',
            { classname: 'bg-success text-light' });
            this.page = 1;
            this.getTotalSize();
            this.getQuizList(this.page);        
          },
            error => {
              this.toastAdd('An error occured while rejecting the quiz.',
              { classname: 'bg-danger text-light' });
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

  
  toastAdd(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  removeToast(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  isTemplate(toast){return toast.textOrTpl instanceof TemplateRef}
}
