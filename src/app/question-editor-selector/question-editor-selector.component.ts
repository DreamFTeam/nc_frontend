import { Component, OnInit, Input } from '@angular/core';
import { ExtendedQuestion } from '../_models/question/extendedquestion';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-question-editor-selector',
  templateUrl: './question-editor-selector.component.html',
  styleUrls: ['./question-editor-selector.component.css']
})
export class QuestionEditorSelectorComponent implements OnInit {

  @Input()
  question: ExtendedQuestion;

  @Input()
  quizId: string;

  thumbnail: any; 

  constructor(private sanitizer: DomSanitizer) { 
  }

  ngOnInit(): void {
  }

  //Changed question type
  onChange(deviceValue) {
    this.question.typeId = parseInt(deviceValue);
  }

  questionImage(e){

  }

  isOneToFour() { return this.question.typeId === 1; }
  isTrueFalse() { return this.question.typeId === 2; }
  isOpenAnswer() { return this.question.typeId === 3; }
  isSequenceAnswer() { return  this.question.typeId === 4; }

}
