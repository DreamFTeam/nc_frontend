import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-true-false',
  templateUrl: './true-false.component.html',
  styleUrls: ['./true-false.component.css']
})
export class TrueFalseComponent implements OnInit {
  id: number = 1;
  title: string;
  rightAnswer: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
