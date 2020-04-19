import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  name: string;
  category: string;
  tags: string;
  description: string;

  constructor() { }

  ngOnInit(): void {
  }

  public add() {
    alert('add');
  }

  public publish() {
    alert('publish');
  }

}
