import { Component, OnInit } from '@angular/core';
import { QuizPreview } from '../_models/quiz-preview';
import { QUIZZES } from './fakequiz';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {

  quizList: QuizPreview[] = QUIZZES;

  constructor() { }

  ngOnInit(): void {

  }

}
