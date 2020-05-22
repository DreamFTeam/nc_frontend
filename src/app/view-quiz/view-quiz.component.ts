import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { QuizService } from '../_services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/role';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YesNoModalComponent } from '../yes-no-modal/yes-no-modal.component';
import { LocaleService } from '../_services/locale.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.css']
})
export class ViewQuizComponent implements OnInit {
  user: User;

  creatorId: string;
  
  quiz: ExtendedQuiz;

  thumbnail: any;

  loading: boolean;

  faSpinner = faSpinner;

  constructor(private quizService: QuizService, private activateRoute: ActivatedRoute, private router: Router,
    private authenticationService: AuthenticationService, private modalService: NgbModal,
    private localeService: LocaleService) { 
      this.loading = true;
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('id')))
     .subscribe(data => this.getAllQuiz(data)); 
  }

  ngOnInit(): void {
    this.user = this.authenticationService.currentUserValue;
  }

  getAllQuiz(data){
    this.quizService.getQuiz(data).subscribe(ans => this.setGettedQuiz(ans),
       err => this.errHandler(this.localeService.getValue('toasterEditor.wentWrong'),err))
  }

  setGettedQuiz(answer){
    this.quiz = answer;
    this.creatorId= answer.creatorId;
    
    this.thumbnail = this.quiz.imageContent;
    this.loading = false;
  }

  markAsFavorite() {
    this.quizService.markAsFavorite(this.quiz.id).subscribe(() => {},
      err => this.errHandler(this.localeService.getValue('toasterEditor.wentWrong'),err));
    this.quiz.favourite = !this.quiz.favourite
  }

  deactivate() {
    this.modal(this.localeService.getValue('modal.deactivateQ'), "danger")
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          this.quizService.deactivate(this.quiz.id).subscribe(
            () => this.quiz.activated = false, 
            err => this.errHandler(this.localeService.getValue('toasterEditor.wentWrong'),err))
        }
      });

  }

  delete(){
    this.modal(this.localeService.getValue('modal.deleteQ'), "danger")
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          this.quizService.delete(this.quiz.id).subscribe(
            () => this.router.navigate(['/']), 
            err => this.errHandler(this.localeService.getValue('toasterEditor.wentWrong'),err))
        }
      });
  }

  modal(text, style): any{
    const modalRef = this.modalService.open(YesNoModalComponent);
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.style =style;

    return modalRef.componentInstance.passEntry;
  }

  errHandler(text, err){
    console.log(err);
    alert(text);
  }

  isMyQuiz(){
    return this.user && this.creatorId === this.user.id;
  }

  isPrivileged(){
    return this.user && (this.user.role !== Role.User); 
  }
}
