import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { QuizFilterComponent } from './quiz-filter/quiz-filter.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { ViewQuizComponent } from './view-quiz/view-quiz.component';



@NgModule({
  declarations: [
    QuizFilterComponent,
    QuizListComponent,
    ViewQuizComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class QuizViewModule { }
