import { Component, OnInit, Input } from '@angular/core';
import { SequenceAnswer } from '../_models/question/sequenceanswer';

@Component({
  selector: 'app-seq-options',
  templateUrl: './seq-options.component.html',
  styleUrls: ['./seq-options.component.css']
})
export class SeqOptionsComponent implements OnInit {
  @Input() question: SequenceAnswer;

  constructor() { }

  ngOnInit(): void {
  }

}
