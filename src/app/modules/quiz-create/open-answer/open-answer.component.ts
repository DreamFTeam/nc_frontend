import { Component, OnInit, Input } from '@angular/core';
import { ExtendedQuestion } from '../../core/_models/question/extendedquestion';

@Component({
  selector: 'app-open-answer',
  templateUrl: './open-answer.component.html',
  styleUrls: ['./open-answer.component.css']
})
export class OpenAnswerComponent implements OnInit {
  @Input() question: ExtendedQuestion;

  @Input()
  available: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
