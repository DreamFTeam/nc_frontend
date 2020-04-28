import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  @Input() id: number;
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

  

}
