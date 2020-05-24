import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BadgeEditorComponent } from './badge-editor/badge-editor.component';
import { OneOfFourComponent } from './one-of-four/one-of-four.component';
import { OpenAnswerComponent } from './open-answer/open-answer.component';
import { QuestionEditorSelectorComponent } from './question-editor-selector/question-editor-selector.component';
import { QuizComponent } from './quiz/quiz.component';
import { SeqOptionsComponent } from './seq-options/seq-options.component';
import { TrueFalseComponent } from './true-false/true-false.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    OneOfFourComponent,
    OpenAnswerComponent,
    SeqOptionsComponent,
    TrueFalseComponent,
    BadgeEditorComponent,
    QuestionEditorSelectorComponent,
    QuizComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class QuizCreateModule { }
