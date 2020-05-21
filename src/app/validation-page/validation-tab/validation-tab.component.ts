import { Component, OnInit, Input, Type, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizValidationPreview } from 'src/app/_models/quiz-validation-preview';
import { QuizValidationListService } from 'src/app/_services/quiz-validation-list.service';
import { Router } from '@angular/router';
import { QuizValidationService } from 'src/app/_services/quiz-validation.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YesNoModalComponent } from '../../yes-no-modal/yes-no-modal.component';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastsService } from 'src/app/_services/toasts.service';
import { ModalService } from 'src/app/_services/modal.service';
import { LocaleService } from 'src/app/_services/locale.service';


@Component({
  selector: 'app-validation-tab',
  templateUrl: './validation-tab.component.html',
  styleUrls: ['./validation-tab.component.css']
})
export class ValidationTabComponent implements OnInit {
  //Pagination: number of items per page
  pageSize: number = 6;

  //src of mock image
  mockImageUrl: string = "../../assets/img/quiz.jpg";
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
    private modalService: ModalService,
    public toastsService: ToastsService,
    private localeService: LocaleService) {
    this.isLoading = true;
    this.isEmpty = false;
    this.toasts = [];
  }

  ngOnInit(): void {
    this.page = 1;
    this.getTotalSize();
    this.getQuizList(this.page);
  }

  getTotalSize(): void {
    this.totalSize$ = this.quizValidationListService.getTotalSize();
    this.totalSize$.subscribe(val => {
      this.isLoading = false;
    },
      error => {
        this.toastsService.toastAddDanger('Couldn\'t fetch list size.');
      });
  }

  getQuizList(page): void {
    this.quizList$ = this.quizValidationListService.getQuizListByPage(page);
    this.quizList$.subscribe(val => {
      if (val.length == 0) {
        this.isEmpty = true;
      }
    }, error => {
      this.toastsService.toastAddDanger('An error occured while fetching the list of quizzes.');
    });
  }

  loadPage(event): void {
    this.getQuizList(event);
  }

  validate(id: string): void {
    this.router.navigateByUrl('/validation/' + id);
  }

  reject(id: string, creatorId: string, title: string): void {
    this.modalService.openModal(this.localeService.getValue('modal.reject'), 'warning')
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          this.quizValidationService.validateQuiz(id, false, "This quiz was instantly rejected without validation", creatorId, title)
            .subscribe(next => {
              this.toastsService.toastAddSuccess(this.localeService.getValue('toasterEditor.rejected'));
              this.page = 1;
              this.getTotalSize();
              this.getQuizList(this.page);
            },
              error => {
                this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
              });
        };
      });
  }
}
