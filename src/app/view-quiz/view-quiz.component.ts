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

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.css']
})
export class ViewQuizComponent implements OnInit {
  creatorId: string;
  
  quiz: ExtendedQuiz;

  thumbnail: any;

  loading: boolean;

  faSpinner = faSpinner;

  constructor(private quizService: QuizService, private activateRoute: ActivatedRoute, private router: Router,
    private authenticationService: AuthenticationService, private modalService: NgbModal) { 
      this.loading = true;
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('id')))
     .subscribe(data => this.getAllQuiz(data)); 
  }

  ngOnInit(): void {}

  getAllQuiz(data){
    this.quizService.getQuiz(data).subscribe(ans => this.setGettedQuiz(ans),
       err => this.errHandler("Quiz could not be retrieved :(",err))
  }

  setGettedQuiz(answer){
    this.quiz = answer;
    this.creatorId= answer.creatorId;
    
    this.thumbnail = this.quiz.imageContent;
    this.loading = false;
    console.log(this.quiz);
  }

  markAsFavorite() {
    this.quizService.markAsFavorite(this.quiz.id).subscribe(() => {},
      err => this.errHandler("Could not mark this quiz as favorite :(",err));
    this.quiz.favourite = !this.quiz.favourite
  }

  deactivate() {
    this.modal("Are you sure you want to deactivate this question?\n"+
    "Once you deactivate a quiz, there is no going back.", "danger")
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          this.quizService.deactivate(this.quiz.id).subscribe(
            () => this.quiz.activated = false, 
            err => this.errHandler("Could not deactivate this quiz :( ",err))
        }
      });

  }

  delete(){
    this.modal("Are you sure you want to delete this question?"+
    "Once you delete a quiz, there is no going back.", "danger")
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          this.quizService.delete(this.quiz.id).subscribe(
            () => this.router.navigate(['/']), 
            err => this.errHandler("Could not deactivate this quiz :( ",err))
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
    return this.creatorId === this.authenticationService.currentUserValue.id;
  }

  isPrivileged(){
    let role = this.authenticationService.currentUserValue.role;
    return role === Role.Admin || role === Role.SuperAdmin || role === Role.Moderator; 
  }
}
