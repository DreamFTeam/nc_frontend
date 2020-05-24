import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../_models/user';
import {Question} from '../_models/question/question';
import {ExtendedQuestion} from '../_models/question/extendedquestion';
import {DomSanitizer} from '@angular/platform-browser';
import {map} from 'rxjs/operators';
import {Alert} from '../_models/alert';
import {environment} from '../../../../environments/environment';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  url = `${environment.apiUrl}quizzes/`;

  user: User;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
              private authenticationService: AuthenticationService) {
    this.user = authenticationService.currentUserValue;

  }

  getAllQuestionsNew(quizId: string): Observable<ExtendedQuestion[]> {
    const options = {
      params: new HttpParams().set('quizId', quizId)

    };

    return this.http.get<ExtendedQuestion[]>(this.url + 'questions', options)
      .pipe(map(data => data.map(x => {
        return new ExtendedQuestion().deserialize(x, this.sanitizer);
      })));
  }

  getAllQuestions(quizId: string) {

    const options = {
      params: new HttpParams().set('quizId', quizId)

    };

    return this.http.get<Question[]>(this.url + 'questions', options);
  }

  sendQuestion(question: ExtendedQuestion, createEdit: boolean) : Observable<ExtendedQuestion>{
    const questionInfo = Object.assign({}, question);
    delete questionInfo.imageContent;

    if (question.typeId === 3 || question.typeId === 4) {
      questionInfo.otherOptions = [];
    }

    const formData = new FormData();
    formData.append("obj", JSON.stringify(questionInfo));
    if(questionInfo.unsanitizedImage !== undefined && questionInfo.unsanitizedImage !== null){
      formData.append("img", questionInfo.unsanitizedImage, questionInfo.unsanitizedImage.name);
    }


    if (createEdit) {
      return this.http.post<ExtendedQuestion>(this.url + 'questions', formData)
        .pipe(map(data => {
          return new ExtendedQuestion().deserialize(data, this.sanitizer);
        }));
    } else {
      return this.http.post<ExtendedQuestion>(this.url + 'questions/edit', formData)
        .pipe(map(data => {
          return new ExtendedQuestion().deserialize(data, this.sanitizer);
        }));
    }
  }



  deleteQuestion(id: string) {
    const options = {
      headers: new HttpHeaders(),
      body: {
        id
      },
    };

    return this.http.delete<Question>(this.url + 'questions', options);
  }

  uploadImage(data: FormData) {
    return this.http.post<Question>(this.url + 'question-image', data);
  }

  questionValidator(question: ExtendedQuestion): string[] {
    let res: string[] = [];


    if (question.title.trim().length < 2) {
      res.push("Question title must be at least 2 symbol length");
    }

    if (question.content.trim().length < 2) {
      res.push("Content must be at least 2 symbol length");
    }

    if (question.rightOptions.includes('') || (question.typeId === 1 && question.otherOptions.includes(''))) {
      res.push("One of answers is empty");
    }

    if (!(question.points > 0)) {
      res.push("Points has value < 0 or has text value");
    }


    return res;
  }

  questionsTotalSize(quizId: string): Observable<number> {
    return this.http.get<number>(this.url + quizId + '/questions/amount');
  }

}
