import { Component, OnInit, Input } from '@angular/core';
import { OpenAnswer } from '../_models/question/openanswer';

@Component({
  selector: 'app-open-answer',
  templateUrl: './open-answer.component.html',
  styleUrls: ['./open-answer.component.css']
})
export class OpenAnswerComponent implements OnInit {
  @Input() question: OpenAnswer;

  constructor() { }

  ngOnInit(): void {
  }

}
