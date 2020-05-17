import { Component, OnInit, TemplateRef } from '@angular/core';
import { QuizService } from '../_services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../_services/question.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ExtendedQuestion } from '../_models/question/extendedquestion';
import { Alert } from '../_models/alert';
import { YesNoModalComponent } from '../yes-no-modal/yes-no-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  tagLabel: string = "Tags";
  categoryLabel: string = "Categories";

  quiz: ExtendedQuiz;
  questions: ExtendedQuestion[];

  questionSelector: ExtendedQuestion;

  thumbnail: any; 
  file: File; 


  quizLoading: boolean;
  questionLoading: boolean;
  faSpinner = faSpinner;


  toasts: any[];


  constructor(private quizService: QuizService, private questionService: QuestionService,
     private activateRoute: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer,
     private modalService: NgbModal) { 
       this.toasts = [];
       this.quizLoading = true;
       this.questionLoading=false;
       this.questions = [];
  }

  ngOnInit(): void {
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
          this.toastAdd('Couldn`t get questions :(', { classname: 'bg-danger text-light'});
        });

    //Find quiz
    this.quizService.getQuiz(data)
      .subscribe(
        ans => this.setGettedQuiz(ans),
        err => {
          console.log(err);
          this.toastAdd('Couldn`t get this quiz :(', { classname: 'bg-danger text-light'});
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
    const validated = this.questionService.questionValidator(this.questionSelector);

    console.log(validated);
    if (validated.length == 0) {
      this.questionLoading = true;
      if (this.questionSelector.id === "") {
        this.questionService.sendQuestion(this.questionSelector, true).subscribe(
          ans => this.setSavedQuestion(ans),
          err => this.setSavedQuestionError(err));

      } else {
        this.questionService.sendQuestion(this.questionSelector, false).subscribe(
          ans => this.setSavedQuestion(ans),
          err => this.setSavedQuestionError(err));
      }

    }else{
      this.toasts = [];
      validated.forEach( x => 
        this.toastAdd(x, { classname: 'bg-danger text-light'}));
    }
  }



  setSavedQuestion(ans){
    const index = this.questions.findIndex( el => el === this.questionSelector);

    this.questions[index] = ans;
    
    console.log(this.questions);
    this.toastAdd('Question saved!', { classname: 'bg-success text-light'});
    this.questionLoading = false;
  }

  setSavedQuestionError(err){
    console.log(err)
    this.toastAdd("Question could not be saved :(", { classname: 'bg-danger text-light'});
    this.questionLoading = false;
  }

  saveQuiz() {
    const validated = this.quizService.quizValidator(this.quiz);

    if (validated.length == 0) {
      this.quizLoading = true;

      if (this.quiz.id === "") {
        this.create();
      }else{
        this.edit();
      }
      
    } else {
      this.toasts = [];
      validated.forEach( x => 
        this.toastAdd(x, { classname: 'bg-danger text-light'}))
    }
  }

  create(){
    this.quizService.createQuiz(this.quiz, this.file).subscribe(

      ans => {
        this.toastAdd('Created!', { classname: 'bg-success text-light'});
        this.quizLoading = false;
        this.router.navigate(['/quizedit/' + ans.id])
      },

      err => {
        console.log(err);
        this.toastAdd('Sorry, couldn`t create your quiz :(', { classname: 'bg-danger text-light'});
      });
  }

  edit(){
    this.quizService.saveQuiz(this.quiz, this.file).subscribe(

      ans => {
        this.toastAdd('Saved!', { classname: 'bg-success text-light'});
        this.quiz = ans;
        this.quizLoading = false;
        console.log(this.quiz.published);
        if(this.quiz.published === true){
          this.router.navigate(['/quizedit/' + ans.id])
        }
        
      },

      err => {
        console.log(err);
        this.toastAdd('Sorry, couldn`t save your quiz :(', { classname: 'bg-danger text-light'});
      });
  }


  publish() {
    this.modal("Are you sure you want to publish this quiz?",  "warning")
    .subscribe((receivedEntry) => {
      if (receivedEntry) {
        this.quizService.publishQuiz(this.quiz.id)
          .subscribe(
            ans => {
              this.toastAdd('Published!', { classname: 'bg-success text-light' });
              this.quiz.published = true;
            },
            err => {
              console.log(err)
              this.toastAdd('Sorry, couldn`t publish your quiz :(', { classname: 'bg-danger text-light' });
            });
      }
    })
  }


  removeQuestionIndex(i, onCreatorDelete){
    this.modal("Are you sure you want to delete this question?",  "danger")
    .subscribe((receivedEntry) => {
      if (receivedEntry) {
         if(this.questions[i].id === ""){
           this.removeQuestionFromList(i, onCreatorDelete);
         }else{
          this.questionService.deleteQuestion(this.questions[i].id)
          .subscribe(
            () => this.removeQuestionFromList(i, onCreatorDelete),
            err => {
              console.log(err);
              this.toastAdd('Sorry, Couldn`t delete this question :(', { classname: 'bg-danger text-light' });
            });
         }
      }
    });
  }

  removeQuestion() {
    this.removeQuestionIndex(this.questions.findIndex( el => el === this.questionSelector), true);
  }

  removeQuestionFromList(index, onCreatorDelete) {
    this.questions.splice(index, 1);
    if (onCreatorDelete) {
      this.questionSelector = undefined
    }
    this.toastAdd('Question removed', { classname: 'bg-success text-light' });
  }

  modal(text, style): any{
    const modalRef = this.modalService.open(YesNoModalComponent);
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.style =style;

    return modalRef.componentInstance.passEntry;
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

  toastAdd(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  removeToast(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }


  
  isQuizCreated(){ return this.quiz !== undefined && this.quiz.id !== ""; }
  isPublishAvailable(){ return this.questions.filter(q => q.id.length > 0).length > 0 && !this.quiz.published }
  isQuestionCreatorAvailable(){ return !this.questionLoading && !this.quizLoading && !this.quiz.published && this.isQuizCreated() }
  isPlusActive(){ return this.questionSelector.id !== ""}
  isTemplate(toast){return toast.textOrTpl instanceof TemplateRef}

}
