import { Component, OnInit } from '@angular/core';
import { ExtendedQuizRatingsPreview } from '../_models/extended-quiz-ratings-preview';
import { Observable } from 'rxjs';
import { UserQuizzesRatingsService } from '../_services/user-quizzes-ratings.service';

@Component({
  selector: 'app-user-quizzes-ratings',
  templateUrl: './user-quizzes-ratings.component.html',
  styleUrls: ['./user-quizzes-ratings.component.css']
})
export class UserQuizzesRatingsComponent implements OnInit {

  mockImgUrl='../../assets/img/quiz.jpg';

  quizList$: Observable<ExtendedQuizRatingsPreview[]>;
  
  constructor(private userQuizzesRatingsService:UserQuizzesRatingsService) { }

  ngOnInit(): void {
    this.quizList$ = this.userQuizzesRatingsService.getUserQuizzesRatingsList();
  }

}
