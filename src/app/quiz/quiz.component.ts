import { Component, OnInit } from '@angular/core';
import { QuizService } from '../_services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../_services/question.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ExtendedQuestion } from '../_models/question/extendedquestion';
import { Alert } from '../_models/alert';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  tagLabel: string = "Tags";
  categoryLabel: string = "Categories";

  quiz: ExtendedQuiz;
  questions: ExtendedQuestion[] = [];

  questionSelector: ExtendedQuestion;

  thumbnail: any; 
  file: File; 


  quizLoading: boolean;
  faSpinner = faSpinner;

  questionAlerts: Alert[] = [];


    // TODO : validation QUIZ AND QUESTION (LINE LENGTH etc.)

  constructor(private quizService: QuizService, private questionService: QuestionService,
     private activateRoute: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer) { 
       
  }

  ngOnInit(): void {
    this.quizLoading = true;

      const id = this.activateRoute.snapshot.params.id;
      if(id === undefined){
        this.initCreateQuiz();
      }else{
        this.getAllQuiz(id)
      }

  }


  initCreateQuiz() {
    this.quiz = new ExtendedQuiz().deserialize({
      id: "",
      title: "",
      description: "",
      creationDate: new Date(),
      creatorId: "",
      author: "",
      activated: false,
      validated: false,
      published: false,
      language: "eng",
      adminComment: "",
      rating: 0,
      tagIdList: [],
      tagNameList: [],
      categoryIdList: [],
      categoryNameList: [],
      isFavourite: false,
      imageContent: ""
    }, this.sanitizer);


    this.quizLoading = false;
  }

  initQuestion(): ExtendedQuestion{

    const res = new ExtendedQuestion().deserialize({
      id: "",
      quizId: this.quiz.id,
      title: "",
      content: "",
      imageContent: "",
      points: 1,
      typeId: 1,
      typeName: "",
      rightOptions: [""],
      otherOptions: [""]

    }, this.sanitizer); 
    return res;
  }

  getAllQuiz(data){
    //Find questions
    this.questionService.getAllQuestionsNew(data)
      .subscribe(
        ans => this.mapGettedQuestions(ans),
        err => {
          console.log(err);
          alert("Couldn`t get questions :(");
        });

    //Find quiz
    this.quizService.getQuizNew(data)
      .subscribe(
        ans => this.setGettedQuiz(ans),
        err => {
          console.log(err);
          alert("Couldn`t get this quiz :(");
        });

  }

  //Gettig quiz by id in url
  setGettedQuiz(answer){    
    this.quiz = answer;
    this.file = this.quiz.unsanitizedImage;
    this.thumbnail = this.quiz.imageContent;

    this.quizLoading = false;

    console.log(this.quiz);
  }

  //Getting questions of quiz in url 
  mapGettedQuestions(ans){
    this.questions = ans;
  }


  //Clicked on already saved questions TODO : show image
  showQuestion(i){
    this.questionSelector = this.questions[i];
    console.log(this.questionSelector);
  }


  addNewQuestion(){
    this.questionSelector = this.initQuestion();
    this.questions.push(this.questionSelector)
  }



  saveQuestion() {
    const alert = this.questionService.questionValidator(this.questionSelector);
    if (alert === undefined) {
      if (this.questionSelector.id === "") {
        this.questionService.sendQuestion(this.questionSelector, true).subscribe(
          ans => this.setSavedQuestion(ans),
          err => console.log(err));

      } else {
        this.questionService.sendQuestion(this.questionSelector, false).subscribe(
          ans => this.setSavedQuestion(ans),
          err => console.log(err));
      }
      this.questionAlerts = [];
    }else{
      this.questionAlerts.push(alert);
    }
  }



  setSavedQuestion(ans){
    const index = this.questions.findIndex( el => el === this.questionSelector);

    this.questions[index] = ans;
    
    console.log(this.questions);
    alert("Question edited!");

  }

  saveQuiz() {
    if (this.quiz.title !== "" && this.quiz.description !== "") {
      this.quizLoading = true;

      if (this.quiz.id === "") {
        this.create();
      }else{
        this.edit();
      }
      
    } else {
      alert("Title and description must be provided");
    }
  }

  create(){
    this.quizService.createQuiz(this.quiz, this.file).subscribe(

      ans => {
        alert("Created!");
        this.quizLoading = false;
        this.router.navigate(['/quizedit/' + ans.id])
      },

      err => {
        console.log(err);
        alert("Sorry, couldn`t create your quiz :(")
      });
  }

  edit(){
    this.quizService.saveQuiz(this.quiz, this.file).subscribe(

      ans => {
        alert("Saved!");
        this.quiz = ans;
        this.quizLoading = false;
        console.log(this.quiz.published);
        if(this.quiz.published === true){
          this.router.navigate(['/quizedit/' + ans.id])
        }
        
      },

      err => {
        console.log(err);
        alert("Sorry, couldn`t save your quiz :(")
      });
  }


  publish() {
    this.quizService.publishQuiz(this.quiz.id)
      .subscribe(
        ans => {
          alert("Published!")
          this.quiz.published = true;
        },
        err => {
          console.log(err)
          alert("Sorry, couldn`t publish your quiz :(")
        });
  }

  removeQuestion() {
    if (this.questionSelector.id === "") {
      this.removeQuestionFromList();
    } else {
      this.questionService.deleteQuestion(this.questionSelector.id)
        .subscribe(
          ans => this.removeQuestionFromList(),
          err => {
            console.log(err);
            alert("Sorry, Couldn`t delete this question :(");
          });
    }
  }

  removeQuestionFromList() {
    const index = this.questions.findIndex( el => el === this.questionSelector);
    this.questions.splice(index, 1);
    this.questionSelector = undefined
    alert("Question removed");
  }

  quizImage(e){
    if(e.target.files[0] !== null && e.target.files[0] !== undefined){
      this.file = e.target.files[0];
      this.setImage();
    }
  }


  setImage(){
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.thumbnail = reader.result;
    }
  }

  removeImage(){
    this.file = null;
    this.thumbnail = null;
  }



  //close alert
  close(alert: Alert) {
    this.questionAlerts.splice(this.questionAlerts.indexOf(alert), 1);
  }

  
  isQuizCreated(){ return this.quiz !== undefined && this.quiz.id !== ""; }
  isPublishAvailable(){ return this.questions.filter(q => q.id.length > 0).length > 0 && !this.quiz.published }
  isQuestionCreatorAvailable(){ return !this.quizLoading && !this.quiz.published && this.isQuizCreated() }
  isPlusActive(){ return this.questionSelector.id !== ""}

}
