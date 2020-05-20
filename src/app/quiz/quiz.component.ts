import { Component, OnInit, TemplateRef } from '@angular/core';
import { QuizService } from '../_services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../_services/question.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ExtendedQuestion } from '../_models/question/extendedquestion';
import { ModalService } from '../_services/modal.service';
import { ToastsService } from '../_services/toasts.service';
import { LocaleService } from '../_services/locale.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  tagLabel: string;
  categoryLabel: string;

  quiz: ExtendedQuiz;
  questions: ExtendedQuestion[];

  questionSelector: ExtendedQuestion;

  thumbnail: any;
  file: File;


  quizLoading: boolean;
  questionLoading: boolean;
  faSpinner = faSpinner;


  constructor(private quizService: QuizService, private questionService: QuestionService,
    private activateRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer,
    private modalService: ModalService, public toastsService: ToastsService,
     private localeService: LocaleService) {
    this.quizLoading = true;
    this.questionLoading = false;
    this.questions = [];
    this.tagLabel = "Tags";
    this.categoryLabel = "Categories";
  }

  ngOnInit(): void {
    this.toastsService.removeAll();
    const id = this.activateRoute.snapshot.params.id;
    if (id === undefined) {
      this.initCreateQuiz();
    } else {
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

  initQuestion(): ExtendedQuestion {

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

  getAllQuiz(data) {
    //Find questions
    this.questionService.getAllQuestionsNew(data)
      .subscribe(
        ans => this.mapGettedQuestions(ans),
        err => {
          console.log(err);
          this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
        });

    //Find quiz
    this.quizService.getQuiz(data)
      .subscribe(
        ans => this.setGettedQuiz(ans),
        err => {
          console.log(err);
          this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
        });

  }

  //Gettig quiz by id in url
  setGettedQuiz(answer) {
    this.quiz = answer;
    this.file = this.quiz.unsanitizedImage;
    this.thumbnail = this.quiz.imageContent;

    this.quizLoading = false;

    console.log(this.quiz);
  }

  //Getting questions of quiz in url 
  mapGettedQuestions(ans) {
    this.questions = ans;
  }


  //Clicked on already saved questions TODO : show image
  showQuestion(i) {
    this.questionSelector = this.questions[i];
    console.log(this.questionSelector);
  }


  addNewQuestion() {
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

    } else {
      this.toastsService.removeAll();
      validated.forEach(x =>
        this.toastsService.toastAddDanger(x));
    }
  }



  setSavedQuestion(ans) {

    const index = this.questions.findIndex(el => el === this.questionSelector);

    this.questions[index] = ans;
    this.questionSelector = this.questions[index];

    console.log(this.questions);
    this.toastsService.toastAddSuccess('Question saved!');
    this.questionLoading = false;
  }

  setSavedQuestionError(err) {
    console.log(err)
    this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
    this.questionLoading = false;
  }

  saveQuiz() {
    const validated = this.quizService.quizValidator(this.quiz);

    if (validated.length == 0) {
      this.quizLoading = true;

      if (this.quiz.id === "") {
        this.createQuiz();
      } else {
        this.editQuiz();
      }

    } else {
      this.toastsService.removeAll();
      validated.forEach(x =>
        this.toastsService.toastAddDanger(x))
    }
  }

  createQuiz() {
    this.quizService.createQuiz(this.quiz, this.file).subscribe(

      ans => {
        this.toastsService.toastAddSuccess(this.localeService.getValue('toasterEditor.created'));
        this.quizLoading = false;
        this.router.navigate(['/quizedit/' + ans.id])
      },

      err => {
        console.log(err);
        this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
      });
  }

  editQuiz() {
    this.quizService.saveQuiz(this.quiz, this.file).subscribe(

      ans => {
        this.toastsService.toastAddSuccess(this.localeService.getValue('toasterEditor.saved'));
        this.quiz = ans;
        this.quizLoading = false;
        console.log(this.quiz.published);
        if (this.quiz.published === true) {
          this.router.navigate(['/quizedit/' + ans.id])
        }

      },

      err => {
        console.log(err);
        this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
      });
  }


  publish() {
    this.modalService
    .openModal(this.localeService.getValue('modal.sure')+this.localeService.getValue('modal.publish'), "warning")
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          this.quizService.publishQuiz(this.quiz.id)
            .subscribe(
              ans => {
                this.toastsService.toastAddSuccess(this.localeService.getValue('toasterEditor.published'));
                this.quiz.published = true;
              },
              err => {
                console.log(err)
                this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
              });
        }
      })
  }


  removeQuestionIndex(i, onCreatorDelete) {
    this.modalService
    .openModal(this.localeService.getValue('modal.sure')+this.localeService.getValue('modal.delete'), "danger")
      .subscribe((receivedEntry) => {
        if (receivedEntry) {
          if (this.questions[i].id === "") {
            this.removeQuestionFromList(i, onCreatorDelete);
          } else {
            this.questionService.deleteQuestion(this.questions[i].id)
              .subscribe(
                () => this.removeQuestionFromList(i, onCreatorDelete),
                err => {
                  console.log(err);
                  this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'));
                });
          }
        }
      });
  }

  removeQuestion() {
    this.removeQuestionIndex(this.questions.findIndex(el => el === this.questionSelector), true);
  }

  removeQuestionFromList(index, onCreatorDelete) {
    this.questions.splice(index, 1);
    if (onCreatorDelete) {
      this.questionSelector = undefined
    }
    this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.removed'));
  }

  quizImage(e) {
    if (e.target.files[0] !== null && e.target.files[0] !== undefined) {
      this.file = e.target.files[0];
      this.setImage();
    }
  }


  setImage() {
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.thumbnail = reader.result;
    }
  }

  removeImage() {
    this.file = null;
    this.thumbnail = null;
  }


  isQuizCreated() { return this.quiz !== undefined && this.quiz.id !== ""; }
  isPublishAvailable() { return this.questions.filter(q => q.id.length > 0).length > 3 && !this.quiz.published }
  isQuestionCreatorAvailable() { return !this.questionLoading && !this.quizLoading && !this.quiz.published && this.isQuizCreated() }
  isPlusActive() { return this.questionSelector.id !== "" }
  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef }

}
