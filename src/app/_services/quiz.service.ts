import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Quiz } from '../_models/quiz';
import { User } from '../_models/user';
import { ExtendedQuiz } from '../_models/extended-quiz';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Category } from '../_models/category';
import { Tag } from '../_models/tag';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { Alert } from '../_models/alert';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  url = `${environment.apiUrl}quizzes/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  user: User;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
              private authenticationService: AuthenticationService) {
                console.log(authenticationService.currentUserValue);
    this.user = authenticationService.currentUserValue;
  }

  saveQuizNew(quiz: ExtendedQuiz): Observable<ExtendedQuiz> {
    console.log(quiz.tagIdList);

    const quizInfo = {
      title: quiz.title,
      quizId: quiz.id,
      creatorId: this.user.id,
      newTitle: quiz.title,
      newLanguage: quiz.language,
      newDescription: quiz.description,
      newImageRef: '',
      newTagList: quiz.tagIdList,
      newCategoryList: quiz.categoryIdList
    };

    console.log(quizInfo);
    return this.http.post<ExtendedQuiz>(this.url + 'edit', JSON.stringify(quizInfo), this.httpOptions)
      .pipe(map(data => {
        return new ExtendedQuiz().deserialize(data, this.sanitizer);
      }));
  }


  createQuizNew(quiz: ExtendedQuiz): Observable<ExtendedQuiz> {
    const quizInfo = {
      title: quiz.title,
      creatorId: this.user.id,
      language: quiz.language,
      description: quiz.description,
      tagList: quiz.tags.map( a => a.id),
      categoryList: quiz.categories.map( a => a.id)
    };

    console.log(quizInfo);

    return this.http.post<ExtendedQuiz>(this.url, JSON.stringify(quizInfo), this.httpOptions);
  }

  getQuizNew(quizId: string): Observable<ExtendedQuiz> {
    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('quizId', quizId).set('userId',this.user.id)

    };

    return this.http.get<ExtendedQuiz>(this.url, options)
      .pipe(map(data => {
        console.log(data);
        return new ExtendedQuiz().deserialize(data, this.sanitizer);
      }));
  }

  getQuiz(quizId: string): Observable<Quiz> {

    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('quizId', quizId)

    };
    return this.http.get<Quiz>(this.url, options);
  }


  markAsFavorite(id: string) {
    const favoriteInfo = {
      quizId: id,
      userId: this.user.id,
    };

    return this.http.post<Quiz>(this.url + 'markasfavourite', JSON.stringify(favoriteInfo), this.httpOptions);
  }


  publishQuiz(id: string) {
    const quizInfo = {
      quizId: id
    };

    return this.http.post<ExtendedQuiz>(this.url + 'markaspublished', JSON.stringify(quizInfo), this.httpOptions);
  }

  getTagsList(): Observable<Tag[]>{
    const options = {
      headers: this.httpOptions.headers,
    }

    return this.http.get<any[]>(this.url+"tags", options)
    .pipe(map(data => data.map(x => {
      return new Tag(x.tag_id, x.description);
    })));
  }

  getCategoriesList() : Observable<Category[]>{
    const options = {
      headers: this.httpOptions.headers,
    }

    return this.http.get<any[]>(this.url+"categories", options)
    .pipe(map(data => data.map(x => {
      console.log(x);
      return new Category(x.category_id, x.title);
    })));;
  }


  quizValidator(quiz: ExtendedQuiz): Alert{
    if(!quiz.title.trim().match("/^[a-z0-9]+$/i")){
      return {type: 'warning', message: 'Title can contain only numbers and letters'};
    }

    if((quiz.title.trim().length < 2)){
      return {type: 'warning', message: 'Title must contain at least 3 symbols'};
    }

    if((quiz.description.trim().length < 2)){
      return {type: 'warning', message: 'Description must contain at least 3 symbols'};
    }
  }

  canIEditQuiz(id: string){
    return id === this.user.id;
  }


  uploadImage(data: FormData) {
    console.log(data);
    return this.http.post(this.url + 'quiz-image', data);
  }

}
