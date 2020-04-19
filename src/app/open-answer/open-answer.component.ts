import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-open-answer',
  templateUrl: './open-answer.component.html',
  styleUrls: ['./open-answer.component.css']
})
export class OpenAnswerComponent implements OnInit {
  id: number = 1;
  title: string;
  answer: string;

  constructor() { }

  ngOnInit(): void {
  }

  onChange(deviceValue) {
    console.log(deviceValue);
    alert(this.title)
  }
}
