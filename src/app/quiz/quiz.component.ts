import { Component, OnInit } from '@angular/core';
import { Quiz } from '../_models/quiz';
import { Question } from '../_models/question/question';
import { OneToFour } from '../_models/question/onetofour';
import { TrueFalse } from '../_models/question/truefalse';
import { OpenAnswer } from '../_models/question/openanswer';
import { SequenceAnswer } from '../_models/question/sequenceanswer';
import { QuizService } from '../_services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
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
  lockedButtons: boolean = false;  //TODO: logic
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

  thumbnail: any; //Quiz image
 

  file: File; //Quiz image file
  file2: File; //Question image file

  questions: Question[] = [];


  //new attributes

  quiz1: ExtendedQuiz;

  questions1: ExtendedQuestion[] = [];

  question1: ExtendedQuestion;

  faSpinner = faSpinner;

  quizLoading: boolean = true;

  constructor(private quizService: QuizService, private questionService: QuestionService,
     private activateRoute: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer) { 
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('id')))
     .subscribe(data => this.getAllQuiz(data)); 
    
  }

  ngOnInit(): void {
    
  }

  //REFACTORED


  getAllQuiz(data){
    //Find questions
    this.questionService.getAllQuestionsNew(data)
    .subscribe(ans =>this.mapGettedQuestions(ans),err => this.getQuestionsErr(err));

    //Find quiz
    this.quizService.getQuizNew(data).subscribe(ans => this.setGettedQuiz(ans),
       err => this.getEditQuizErr(err));

  }

  //Gettig quiz by id in url
  setGettedQuiz(answer){    
    this.quiz1 = answer;
    this.thumbnail = this.quiz1.imageContent;

    this.question1 = this.initQuestion();

    this.quizLoading = false;
  }

  //Getting questions of quiz
  mapGettedQuestions(ans){
  
    this.questions1 = ans;

    console.log(this.questions1);
  }


  //Clicked on already saved questions
  showQuestion(i){

    this.question1 = this.questions1[i];
    
    //this.thumbnail2 = this.question1.imageContent
  }


  addNewQuestion(){
    this.question1 = this.initQuestion();
  }



  //END OF REFACTORED

  //Save(create) quiz button
  createQuiz(){
    if(this.quiz.title !== "" && this.quiz.description !== ""){
      if(this.quiz.id === ""){
        this.quizService.createQuiz(this.quiz).subscribe(ans =>this.mapCreatedQuiz(ans),err => this.getCreatedErr(err));
      }else{
        this.quizService.saveQuiz(this.quiz).subscribe(ans => this.mapSavedQuiz(ans),err => console.log(err));
      }
    }else{
      alert("Title and description must be provided");
    }
    
  }

  mapSavedQuiz(ans){
    alert("Quiz saved!");
    this.quiz.id = ans.id;
    this.quizService.uploadImage(this.getFormData(this.file,true))
    .subscribe(ans =>console.log(ans),err => alert("Couldn`t upload image: "+err));

    this.router.navigate(['/quizedit/'+this.quiz.id]);
  }


  //Get id of created quiz
  mapCreatedQuiz(ans){
    alert("Quiz created!");
    this.quiz.id = ans.id;
    console.log(this.quiz);
    this.quizService.uploadImage(this.getFormData(this.file,true))
    .subscribe(ans =>console.log(ans),err => alert("Couldn`t upload image: "+err));
    
    this.router.navigate(['/quizedit/'+this.quiz.id]);
  }


  

  // //GET questions of quiz
  // mapCreatedQuestion(ans){
  //   alert("Question created!");
  //   this.question.id = ans.id;
  //   console.log(this.question);
  //   this.questions.push(Object.create(this.question));
  //   this.questionService.uploadImage(this.getFormData(this.file2,false))
  //   .subscribe(ans =>console.log(ans),err => alert("Couldn`t upload image: "+err));
  // }

  // mapEditedQuestion(ans){
  //   alert("Question edited!");
  //   this.question.id = ans.id;
  //   console.log(this.question);
  //   this.questionService.uploadImage(this.getFormData(this.file2,false))
  //   .subscribe(ans =>console.log(ans),err => alert("Couldn`t upload image: "+err));
  // }

  //Created quiz error
  getCreatedErr(err){
    alert("Quiz could not be created: "+err.error.message);
  }

  //Cannot get quiz or id is empty
  getEditQuizErr(err){
    this.lockedButtons=false;
  }

  getCreatedQuestionErr(err){
    console.log(err);
    alert("Question could not be created: "+err.error.message);
  }

  getQuestionsErr(err){
    console.log(err);
    alert("Questions could not be retrieved: "+err.error.message);
  }

  saveQuestion() {
    console.log(this.question1);
    this.questionService.sendQuestion(this.question1, true).subscribe(ans => alert(ans), err => console.log(err));
  }

  //Saving question
  // saveQuestion() {
  //   if(this.question.points > 0){
  //     if(this.question.title !== "" || this.question.content !== ""){
  //       if(this.question instanceof OneToFour){
  //         if(!this.question.answers.includes("") && this.question.rightAnswers.includes(true)){
  //           if(this.question.id === ""){
  //             this.questionService.firstType(this.question, this.quiz.id, true).subscribe(ans => this.mapCreatedQuestion(ans),
  //           err => this.getCreatedQuestionErr(err));
  //           }else{
  //             this.questionService.firstType(this.question, this.quiz.id, false).subscribe(ans => this.mapEditedQuestion(ans),
  //           err => this.getCreatedQuestionErr(err));
  //           }
            

  //         }else{
  //           alert("No right question or one of questions is empty");
  //         }
  //       }

  //       if(this.question instanceof TrueFalse){
  //         if(this.question.id === ""){
  //           this.questionService.secondType(this.question, this.quiz.id, true).subscribe(ans => this.mapCreatedQuestion(ans),
  //             err => this.getCreatedQuestionErr(err));
  //         }else{
  //           this.questionService.secondType(this.question, this.quiz.id, false).subscribe(ans => this.mapEditedQuestion(ans),
  //             err => this.getCreatedQuestionErr(err));
  //         }
  //       }

  //       if(this.question instanceof OpenAnswer){
  //         if(this.question.id === ""){
  //           this.questionService.thirdType(this.question, this.quiz.id, true).subscribe(ans => this.mapCreatedQuestion(ans),
  //             err => this.getCreatedQuestionErr(err));
  //         }else{
  //           this.questionService.thirdType(this.question, this.quiz.id, false).subscribe(ans => this.mapEditedQuestion(ans),
  //             err => this.getCreatedQuestionErr(err));
  //         }
  //       }

  //       if(this.question instanceof SequenceAnswer){
  //         console.log(this.question);
  //         if(this.question.id === ""){
  //           this.questionService.fourthType(this.question, this.quiz.id, true).subscribe(ans => this.mapCreatedQuestion(ans),
  //             err => this.getCreatedQuestionErr(err));
  //         }else{
  //           this.questionService.fourthType(this.question, this.quiz.id, false).subscribe(ans => this.mapEditedQuestion(ans),
  //           err => this.getCreatedQuestionErr(err));
  //         }
  //       }

  //     }else{
  //       alert("Title or content is empty");
  //     }  
  //   }else{
  //     alert("Points can`t be zero, negative or not numeric");
  //   }
    
  // }

  

  

  public publish() {
    if(this.questions.length > 0) {
      this.quizService.publishQuiz(this.quiz.id).subscribe(ans =>console.log(ans),err => console.log(err));
    }else{
      alert("Quiz could not be witout questions")
    }
  }

  

  //Removing questin or clear input
  removeQuestion(){
    if(this.question1.id === ""){
      //this.clearInputs();
      alert("Inputs cleared");
    }else{
      this.questionService.deleteQuestion(this.question1.id)
      .subscribe(ans =>this.removeQuestionSuccess(ans),err => this.removeQuestionErr(err));
      
    }
  }

  removeQuestionSuccess(ans){
    console.log(ans);
    const index = this.questions1.findIndex(question => question.id === this.question1.id); 
      this.questions1.splice(index, 1); 
      alert("Question removed");
  }

  removeQuestionErr(err){
    console.log(err);
    alert("Could not delete this question");
  }


  // private clearInputs(){
  //   switch(this.question.typeId){
  //     case 1: { 
  //       this.question = new OneToFour("","","",new Blob(),0,this.quiz.id,1,["",""],[]);
  //       break; 
  //    } 
  //    case 2: { 
  //       this.question = new TrueFalse("","","",new Blob(),0,this.quiz.id,1,"true","false");
  //       break; 
  //    } 
  //    case 3: {
  //       this.question = new OpenAnswer("","","",new Blob(),0,this.quiz.id,1,"");
  //       break; 
  //    } 
  //    case 4: {     
  //      this.question = new SequenceAnswer("","","",new Blob(),0,this.quiz.id,1,["","",""]);
  //      break; 
  //   } 
  //   }
  // }

  quizImage(e){
    this.file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.thumbnail = reader.result;
    }

    //this.quizService.uploadImage(formData).subscribe(ans =>console.log(ans),err => console.log(err));
  }

  questionImage(e){
    this.file2 = e.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(this.file2);
    reader.onload = () => {
      //this.thumbnail2 = reader.result;
    }

    //this.questionService.uploadImage(formData).subscribe(ans =>console.log(ans),err => console.log(err));
  }

  getFormData(file: File, type: boolean): FormData {

    const formData = new FormData();
    formData.append('img', file);
    if(type){
      formData.append('quizId',this.quiz.id);
    }else{
      formData.append('questionId',this.question1.id);
    }
    

    return formData;
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

  
  isQuizCreated(){ return this.quiz.id !== ""; }

}
