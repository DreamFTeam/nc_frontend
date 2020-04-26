import { Component, OnInit } from '@angular/core';
import { Quiz } from '../_models/quiz';
import { QuizService } from '../_services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.css']
})
export class ViewQuizComponent implements OnInit {
  quiz: Quiz = {
    id: "",
    title: "",
    category: ["3b338765-c75d-40e2-9ab0-789738acd07a"],
    tags: ["c03a2080-d447-4bde-be2e-6f22c6ebee63"],
    description: "",
    imageReference: new Blob(),
    creationDate: new Date(),
    creatorId: "",
    activated: false,
    validated: false,
    quizLanguage: "eng",
    adminCommentary: "",
    rating: 0,
    published: false,

  };

  constructor(private quizService: QuizService, private activateRoute: ActivatedRoute) { 
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('id')))
     .subscribe(data => this.getAllQuiz(data)); 
  }

  getAllQuiz(data){
    this.quizService.getQuiz(data).subscribe(ans => this.mapGettedQuiz(ans),
       err => this.getEditQuizErr(err))
  }

  mapGettedQuiz(answer){
    console.log("answer");
    console.log(answer);
    this.quiz.id=answer.id;
    this.quiz.title=answer.title;
    this.quiz.description=answer.description;
    this.quiz.imageReference=answer.imageRef;
    this.quiz.quizLanguage=answer.language;
    this.quiz.tags = answer.tagNameList;
    this.quiz.category = answer.categoryNameList;
    this.quiz.creationDate = answer.creationDate;
    this.quiz.creatorId = answer.creatorId;
    
  }

  getEditQuizErr(err){
    alert("Quiz could not be retrieved: "+err.error.message);
  }

  markAsFavorite(){
    this.quizService.markAsFavorite(this.quiz.id).subscribe(ans => alert("Marked as favorite"),
       err => console.log(err))
  }

  isMyQuiz(){
    return this.quizService.canIEditQuiz(this.quiz.creatorId);
  }


  ngOnInit(): void {

  }

}
