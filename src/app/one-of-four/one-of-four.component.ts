import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-one-of-four',
  templateUrl: './one-of-four.component.html',
  styleUrls: ['./one-of-four.component.css']
})
export class OneOfFourComponent implements OnInit {
  id: number = 1;
  title: string;
  answers: string[] = [];
  rightAnswers: boolean[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
