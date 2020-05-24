import { Component, OnInit } from '@angular/core';
import { ExtendedQuizRatingsPreview } from '../../core/_models/extended-quiz-ratings-preview';
import { Observable } from 'rxjs';
import { UserQuizzesRatingsService } from '../../core/_services/user/user-quizzes-ratings.service';

@Component({
  selector: 'app-user-quizzes-ratings',
  templateUrl: './user-quizzes-ratings.component.html',
  styleUrls: ['./user-quizzes-ratings.component.css']
})
export class UserQuizzesRatingsComponent implements OnInit {

  mockImgUrl='../../assets/img/quiz.jpg';

  quizList$: Observable<ExtendedQuizRatingsPreview[]>;
  
  isEmpty: boolean;
  constructor(private userQuizzesRatingsService:UserQuizzesRatingsService) { 
    this.isEmpty = false;
  }

  ngOnInit(): void {
    this.quizList$ = this.userQuizzesRatingsService.getUserQuizzesRatingsList();
    this.quizList$.subscribe(v => {
      if(v.length == 0){
        this.isEmpty = true;
      }
    });
  }

}
