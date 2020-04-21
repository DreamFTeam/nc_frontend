import { Component, OnInit, Input } from '@angular/core';
import { OneToFour } from '../_models/question/onetofour';

@Component({
  selector: 'app-one-of-four',
  templateUrl: './one-of-four.component.html',
  styleUrls: ['./one-of-four.component.css']
})
export class OneOfFourComponent implements OnInit {
  @Input() question: OneToFour;


  constructor() {
  }

  ngOnInit(): void {
  }

}
