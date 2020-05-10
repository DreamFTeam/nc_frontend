import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { QuizService } from '../_services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { ExtendedQuiz } from '../_models/extended-quiz';

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.css']
})
export class ViewQuizComponent implements OnInit {
  id: string;
  
  quiz: ExtendedQuiz;

  thumbnail: any;

  loading: boolean;

  faSpinner = faSpinner;

  constructor(private quizService: QuizService, private activateRoute: ActivatedRoute,
    private sanitizer: DomSanitizer) { 
      this.loading = true;
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('id')))
     .subscribe(data => this.getAllQuiz(data)); 
  }

  getAllQuiz(data){
    this.quizService.getQuizNew(data).subscribe(ans => this.setGettedQuiz(ans),
       err => this.getEditQuizErr(err))
  }

  setGettedQuiz(answer){
    this.quiz = answer;
    this.id= answer.creatorId;
    
    this.thumbnail = this.quiz.imageContent;
    this.loading = false;
    console.log(this.quiz)
  }

  getEditQuizErr(err){
    alert("Quiz could not be retrieved: "+err.error.message);
  }

  markAsFavorite(){
    this.quizService.markAsFavorite(this.quiz.id).subscribe(ans => ans,
       err => this.quiz.favourite = !this.quiz.favourite);
       this.quiz.favourite = !this.quiz.favourite
  }

  isMyQuiz(){
    return this.quizService.canIEditQuiz(this.id);
  }


  ngOnInit(): void {

  }

}
