import { Component, OnInit } from '@angular/core';
import { ShortQuizListService } from '../_services/short-quiz-list.service';
import { Observable, of } from 'rxjs';
import { ExtendedQuiz } from '../_models/extended-quiz';

@Component({
  selector: 'app-short-quiz-list',
  templateUrl: './short-quiz-list.component.html',
  styleUrls: ['./short-quiz-list.component.css']
})
export class ShortQuizListComponent implements OnInit {

  pageSize: number = 4;

  startIndex: number;
  endIndex: number;
  shortQuizList$: Observable<ExtendedQuiz[]>;
  //listToShow$: Observable<ExtendedQuiz[]>;
  mockImgUrl = "../../assets/img/quiz.jpg";


  constructor(private shortQuizListService: ShortQuizListService) { }

  ngOnInit(): void {
    this.startIndex = 0;
    this.endIndex = this.startIndex + this.pageSize;
    this.getShortQuizList();
  }

  getShortQuizList(): void{
    this.shortQuizList$ = this.shortQuizListService.getShortQuizList();
  }

  slideRight():void{
    if((this.endIndex + 1) >= 9){
      this.startIndex = 0;
      this.endIndex = this.startIndex + this.pageSize;
    }else{
      this.startIndex += 1;
      this.endIndex += 1;
    }
  }

  slideLeft():void{
    if((this.startIndex - 1) <= 0){
      this.endIndex = 9;
      this.startIndex = this.endIndex - this.pageSize;
    }else{
      this.startIndex -= 1;
      this.endIndex -= 1;
    }
  }
}
