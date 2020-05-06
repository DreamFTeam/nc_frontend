import { Component, OnInit } from '@angular/core';
import { QuizService } from '../_services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../_services/question.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ExtendedQuestion } from '../_models/question/extendedquestion';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  quiz1: ExtendedQuiz;
  questions1: ExtendedQuestion[] = [];
  question1: ExtendedQuestion;

  thumbnail: any; 
  file: File; 

  questionData: FormData;

  quizLoading: boolean;
  faSpinner = faSpinner;


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
    this.quiz1 = new ExtendedQuiz().deserialize({
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
      tagIdList: ["c03a2080-d447-4bde-be2e-6f22c6ebee63"],
      tagNameList: [],
      categoryIdList: ["3b338765-c75d-40e2-9ab0-789738acd07a"],
      categoryNameList: [],
      isFavourite: false,
      imageContent: ""
    }, this.sanitizer);


    this.quizLoading = false;
  }

  initQuestion(): ExtendedQuestion{

    const res = new ExtendedQuestion().deserialize({
      id: "",
      quizId: this.quiz1.id,
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
    this.quiz1 = answer;
    this.thumbnail = this.quiz1.imageContent;

    this.quizLoading = false;

    console.log(this.quiz1);
  }

  //Getting questions of quiz 
  mapGettedQuestions(ans){
    this.questions1 = ans;

    console.log(this.questions1);
  }


  //Clicked on already saved questions TODO : show image
  showQuestion(i){

    this.question1 = this.questions1[i];

    this.questionData.set("img","");
    this.questionData.set("questionId",this.question1.id);

  }


  // TODO : new question logic
  addNewQuestion(){
    this.question1 = this.initQuestion();
    this.questions1.push(this.question1)
  }


  // TODO : VALIDATION, image add
  saveQuestion() {
    if(this.question1.id === ""){

      this.questionService.sendQuestion(this.question1, true).subscribe(
        ans => this.mapCreatedQuestion(ans),
        err => console.log(err));

    }else{

      this.questionService.sendQuestion(this.question1, false).subscribe(
        ans => this.mapEditedQuestion(ans),
        err => console.log(err));

    }
  }


  //TODO : fix send image
  mapCreatedQuestion(ans){
    alert("Question created!");

    this.question1.id = ans.id;

    this.questionData.set("questionId",this.question1.id);

    if(this.questionData.get("img") !== ""){
      this.questionService.uploadImage(this.questionData)
        .subscribe(ans => console.log(ans), err => alert("Couldn`t upload image: " + err));
    }
    
  }

  //TODO : fix send image
  mapEditedQuestion(ans){

    alert("Question edited!");


    console.log(this.questionData.get("questionId"));
    if(this.questionData.get("img") !== ""){
      this.questionService.uploadImage(this.questionData)
        .subscribe(ans => console.log(ans), err => alert("Couldn`t upload image: " + err));
    }
  }


  //TODO : fix realization (image in save, save published quizzes logic)
  saveQuiz() {
    if (this.quiz1.title !== "" && this.quiz1.description !== "") {
      

      if(this.file !== undefined && this.quiz1.id !== ""){
        this.quizService.uploadImage(this.getFormData(this.quiz1.id))
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
    if (this.quiz1.id === "") {
      this.quizService.createQuizNew(this.quiz1).subscribe(

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
      this.quizService.saveQuizNew(this.quiz1).subscribe(

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
    this.quizService.publishQuiz(this.quiz1.id)
      .subscribe(
        ans => alert("Published!"),
        err => {
          console.log(err)
          alert("Sorry, couldn`t publish your quiz :(")
        });
  }

  //Removing questin or clear input TODO : logic with new adding
  removeQuestion() {
    if (this.question1.id === "") {
      //this.clearInputs();
      alert("Inputs cleared");
    } else {
      this.questionService.deleteQuestion(this.question1.id)
        .subscribe(
          ans => this.removeQuestionSuccess(),
          err => {
            console.log(err);
            alert("Sorry, Couldn`t delete this question :(");
          });
    }
  }

  removeQuestionSuccess() {
    const index = this.questions1.findIndex(question => question.id === this.question1.id);
    this.questions1.splice(index, 1);
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

  
  isQuizCreated(){ return this.quiz1 !== undefined && this.quiz1.id !== ""; }
  isPublishAvailable(){ return this.questions1.filter(q => q.id.length > 0).length > 0 && !this.quiz1.published }
  isQuestionCreatorAvailable(){ return !this.quizLoading && !this.quiz1.published && this.isQuizCreated() }
  isPlusActive(){ return this.question1.id !== ""}

}
