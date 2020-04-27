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
  thumbnail2: any; //Question image

  file: File; //Quiz image file
  file2: File; //Question image file

  questions: Question[] = [];
  question: Question = new OneToFour("","","",new Blob(),0,this.quiz.id,1,["",""],[false,false]);

  constructor(private quizService: QuizService, private questionService: QuestionService,
     private activateRoute: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer) { 
    this.activateRoute.paramMap.pipe(
      switchMap(params => params.getAll('id')))
     .subscribe(data => this.getAllQuiz(data)); 
    
  }

  ngOnInit(): void {
    
  }


  getAllQuiz(data){
    this.questionService.getAllQuestions(data)
    .subscribe(ans =>this.mapGettedQuestions(ans),err => this.getQuestionsErr(err));
    this.quizService.getQuiz(data).subscribe(ans => this.mapGettedQuiz(ans),
       err => this.getEditQuizErr(err))
  }

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
    this.questionService.uploadImage(this.getFormData(this.file,true))
    .subscribe(ans =>console.log(ans),err => alert("Couldn`t upload image: "+err));
  }


  //Get id of created quiz
  mapCreatedQuiz(ans){
    alert("Quiz created!");
    this.quiz.id = ans.id;
    console.log(this.quiz);
    this.router.navigate(['/quizedit/'+this.quiz.id]);
  }


  //Gettig quiz by id in url
  mapGettedQuiz(answer){
    this.quiz.id=answer.id;
    this.quiz.title=answer.title;
    this.quiz.description=answer.description;
    this.quiz.imageReference=answer.imageContent;
    this.quiz.quizLanguage=answer.language;
    this.quiz.published = answer.published;
    //TODO: map tags and categs
    this.lockedButtons=false;
    console.log(this.quiz);

    const objectURL = 'data:image/jpeg;base64,' + this.quiz.imageReference;
    this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  //GET questions of quiz
  mapCreatedQuestion(ans){
    alert("Question created!");
    this.question.id = ans.id;
    console.log(this.question);
    this.questions.push(Object.create(this.question));
    this.questionService.uploadImage(this.getFormData(this.file2,false))
    .subscribe(ans =>console.log(ans),err => alert("Couldn`t upload image: "+err));
    
    
  }


  //Getting questions of quiz
  mapGettedQuestions(ans){
    console.log(ans);
    for (let question of ans){
      if(question.typeId === 1){
        let rightAnswers: boolean[] = [];
        for (let i = 0; i < question.otherOptions.length; i++) {
          rightAnswers.push(false);
        }
        for (let i = 0; i < question.rightOptions.length; i++) {
          rightAnswers.push(true);
        }

        this.questions.push(new OneToFour(question.id,question.title,question.content,
          question.imageContent, question.points,question.quizId,question.typeId,
          question.otherOptions.concat(question.rightOptions),rightAnswers));

          this.question.image = question.imageContent;
      }
      if(question.typeId === 2){
        let otherOption: string;
        if(question.rightOptions[0]){
          otherOption = "false";
        }else{
          otherOption = "true";
        }

        this.questions.push(new TrueFalse(question.id,question.title,question.content,
          question.imageContent, question.points,question.quizId,question.typeId,
          otherOption,question.rightOptions[0]));
      }
      if(question.typeId === 3){
        this.questions.push(new OpenAnswer(question.id,question.title,question.content,
          question.imageContent, question.points,question.quizId,question.typeId,
          question.rightOptions[0]));
      }
      if(question.typeId === 4){
        this.questions.push(new SequenceAnswer(question.id,question.title,question.content,
          question.imageContent, question.points,question.quizId,question.typeId,
          question.rightOptions));
      }
    }

    console.log(this.question);
  }

  mapEditedQuestion(ans){
    alert("Question edited!");
    this.question.id = ans.id;
    console.log(this.question);
    this.questionService.uploadImage(this.getFormData(this.file2,false))
    .subscribe(ans =>console.log(ans),err => alert("Couldn`t upload image: "+err));
  }

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

  //Saving question
  saveQuestion() {
    if(this.question.points > 0){
      if(this.question.title !== "" || this.question.content !== ""){
        if(this.question instanceof OneToFour){
          if(!this.question.answers.includes("") && this.question.rightAnswers.includes(true)){
            if(this.question.id === ""){
              this.questionService.firstType(this.question, this.quiz.id, true).subscribe(ans => this.mapCreatedQuestion(ans),
            err => this.getCreatedQuestionErr(err));
            }else{
              this.questionService.firstType(this.question, this.quiz.id, false).subscribe(ans => this.mapEditedQuestion(ans),
            err => this.getCreatedQuestionErr(err));
            }
            

          }else{
            alert("No right question or one of questions is empty");
          }
        }

        if(this.question instanceof TrueFalse){
          if(this.question.id === ""){
            this.questionService.secondType(this.question, this.quiz.id, true).subscribe(ans => this.mapCreatedQuestion(ans),
              err => this.getCreatedQuestionErr(err));
          }else{
            this.questionService.secondType(this.question, this.quiz.id, false).subscribe(ans => this.mapEditedQuestion(ans),
              err => this.getCreatedQuestionErr(err));
          }
        }

        if(this.question instanceof OpenAnswer){
          if(this.question.id === ""){
            this.questionService.thirdType(this.question, this.quiz.id, true).subscribe(ans => this.mapCreatedQuestion(ans),
              err => this.getCreatedQuestionErr(err));
          }else{
            this.questionService.thirdType(this.question, this.quiz.id, false).subscribe(ans => this.mapEditedQuestion(ans),
              err => this.getCreatedQuestionErr(err));
          }
        }

        if(this.question instanceof SequenceAnswer){
          console.log(this.question);
          if(this.question.id === ""){
            this.questionService.fourthType(this.question, this.quiz.id, true).subscribe(ans => this.mapCreatedQuestion(ans),
              err => this.getCreatedQuestionErr(err));
          }else{
            this.questionService.fourthType(this.question, this.quiz.id, false).subscribe(ans => this.mapEditedQuestion(ans),
            err => this.getCreatedQuestionErr(err));
          }
        }

      }else{
        alert("Title or content is empty");
      }  
    }else{
      alert("Points can`t be zero, negative or not numeric");
    }
    
  }

  addNewQuestion(){
    this.question = new OneToFour("","","",new Blob(),0,this.quiz.id,1,["",""],[false,false]);
  }

  showAnswer(i){
    this.question = this.questions[i];
    
    const objectURL = 'data:image/jpeg;base64,' + this.question.image;
    this.thumbnail2 = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  public publish() {
    if(this.questions.length > 0) {
      this.quizService.publishQuiz(this.quiz.id).subscribe(ans =>console.log(ans),err => console.log(err));
    }else{
      alert("Quiz could not be witout questions")
    }
  }

  //Changed question type
  onChange(deviceValue) {
    console.log(deviceValue);
    

    switch(deviceValue) { 
      case "1": { 
         this.question = new OneToFour("","","",new Blob(),0,this.quiz.id,1,["",""],[]);
         break; 
      } 
      case "2": { 
         this.question = new TrueFalse("","","",new Blob(),0,this.quiz.id,1,"true","false");
         break; 
      } 
      case "3": {
         this.question = new OpenAnswer("","","",new Blob(),0,this.quiz.id,1,"");
         break; 
      } 
      case "4": {     
        this.question = new SequenceAnswer("","","",new Blob(),0,this.quiz.id,1,["","",""]);
        break; 
     } 
   }
  }

  //Removing questin or clear input
  removeQuestion(){
    if(this.question.id === ""){
      this.clearInputs();
      alert("Inputs cleared");
    }else{
      this.questionService.deleteQuestion(this.question.id)
      .subscribe(ans =>this.removeQuestionSuccess(ans),err => this.removeQuestionErr(err));
      
    }
  }

  removeQuestionSuccess(ans){
    console.log(ans);
    const index = this.questions.findIndex(question => question.id === this.question.id); 
      this.questions.splice(index, 1); 
      alert("Question removed");
  }

  removeQuestionErr(err){
    console.log(err);
    alert("Could not delete this question");
  }


  private clearInputs(){
    switch(this.question.typeId){
      case 1: { 
        this.question = new OneToFour("","","",new Blob(),0,this.quiz.id,1,["",""],[]);
        break; 
     } 
     case 2: { 
        this.question = new TrueFalse("","","",new Blob(),0,this.quiz.id,1,"true","false");
        break; 
     } 
     case 3: {
        this.question = new OpenAnswer("","","",new Blob(),0,this.quiz.id,1,"");
        break; 
     } 
     case 4: {     
       this.question = new SequenceAnswer("","","",new Blob(),0,this.quiz.id,1,["","",""]);
       break; 
    } 
    }
  }

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
      this.thumbnail2 = reader.result;
    }

    //this.questionService.uploadImage(formData).subscribe(ans =>console.log(ans),err => console.log(err));
  }

  getFormData(file: File, type: boolean): FormData {

    const formData = new FormData();
    formData.append('img', file);
    if(type){
      formData.append('quizId',this.quiz.id);
    }else{
      formData.append('questionId',this.question.id);
    }
    

    return formData;
  }

  isOneToFour(val) { return val instanceof OneToFour; }
  isTrueFalse(val) { return val instanceof TrueFalse; }
  isOpenAnswer(val) { return val instanceof OpenAnswer; }
  isSequenceAnswer(val) { return  val instanceof SequenceAnswer; }
  isQuizCreated(){ return this.quiz.id !== ""; }
  isButtonLocked(){ return !this.isQuizCreated() && this.lockedButtons; }

}
