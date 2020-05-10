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

  questionData: FormData;

  quizLoading: boolean;
  faSpinner = faSpinner;

  questionAlerts: Alert[] = [];


  constructor(private quizService: QuizService, private questionService: QuestionService,
     private activateRoute: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer) { 
       this.quizLoading = true;

      const id = this.activateRoute.snapshot.params.id;
      if(id === undefined){
        this.initCreateQuiz();
      }else{
        this.getAllQuiz(id)
      }
  }

  ngOnInit(): void {
    this.questionData = new FormData();
    this.questionData.append("img","");
    this.questionData.append("questionId","");
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
    this.thumbnail = this.quiz.imageContent;

    this.quizLoading = false;

    console.log(this.quiz);
  }

  //Getting questions of quiz in url 
  mapGettedQuestions(ans){
    this.questions = ans;

    console.log(this.questions);
  }


  //Clicked on already saved questions TODO : show image
  showQuestion(i){
    this.questionSelector = this.questions[i];

    this.questionData.set("img","");
    this.questionData.set("questionId",this.questionSelector.id);

  }


  addNewQuestion(){
    this.questionSelector = this.initQuestion();
    this.questions.push(this.questionSelector)
  }


  // TODO : image add
  saveQuestion() {
    const alert = this.questionService.questionValidator(this.questionSelector);
    if (alert === undefined) {
      if (this.questionSelector.id === "") {
        this.questionService.sendQuestion(this.questionSelector, true).subscribe(
          ans => this.setCreatedQuestion(ans),
          err => console.log(err));

      } else {
        this.questionService.sendQuestion(this.questionSelector, false).subscribe(
          ans => this.setEditedQuestion(ans),
          err => console.log(err));
      }
      this.questionAlerts = [];
    }else{
      this.questionAlerts.push(alert);
    }
  }


  //TODO : fix send image
  setCreatedQuestion(ans){
    alert("Question created!");

    this.questionSelector.id = ans.id;

    this.questionData.set("questionId",this.questionSelector.id);

    if(this.questionData.get("img") !== ""){
      this.questionService.uploadImage(this.questionData)
        .subscribe(ans => console.log(ans), err => alert("Couldn`t upload image: " + err));
    }
    
  }

  //TODO : fix send image
  setEditedQuestion(ans){

    alert("Question edited!");


    console.log(this.questionData.get("questionId"));
    if(this.questionData.get("img") !== ""){
      this.questionService.uploadImage(this.questionData)
        .subscribe(ans => console.log(ans), err => alert("Couldn`t upload image: " + err));
    }
  }


  //TODO : fix realization (image in save, save published quizzes logic)
  saveQuiz() {
    if (this.quiz.title !== "" && this.quiz.description !== "") {
      

      if(this.file !== undefined && this.quiz.id !== ""){
        this.quizService.uploadImage(this.getFormData(this.quiz.id))
        .subscribe(
          ans => this.createEditQuiz(),
          err => {
            console.log(err);
            alert("Sorry, couldn`t upload your image :( (Quiz is not saved)")
          }
        )
      }else{
        this.createEditQuiz();
      }

      
    } else {
      alert("Title and description must be provided");
    }
  }

  createEditQuiz(){
    if (this.quiz.id === "") {
      this.quizService.createQuizNew(this.quiz).subscribe(

        ans => {
          if (this.file !== undefined) {
            this.quizService.uploadImage(this.getFormData(ans.id))
            .subscribe(
              ans => ans,
              err => {
                console.log(err);
                alert("Sorry, couldn`t upload your image :( (Quiz is not saved)")
              }
            )
          }

          alert("Created!");
          this.router.navigate(['/quizedit/' + ans.id])
        },

        err => {
          console.log(err);
          alert("Sorry, couldn`t create your quiz :(")
        });
    } else {
      this.quizService.saveQuizNew(this.quiz).subscribe(

        ans => {
          alert("Saved!");
          this.router.navigate(['/quizedit/' + ans.id])
        },

        err => {
          console.log(err);
          alert("Sorry, couldn`t save your quiz :(")
        });
    }
  }

  publish() {
    this.quizService.publishQuiz(this.quiz.id)
      .subscribe(
        ans => alert("Published!"),
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
    this.file = e.target.files[0];
    this.setImage(this.file);
  }


  setImage(file: File){
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.thumbnail = reader.result;
    }
  }


  getFormData(id: string): FormData {

    const formData = new FormData();
    formData.append('img', this.file);
    formData.append('quizId',id);

    return formData;
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
