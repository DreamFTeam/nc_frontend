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

  saveQuiz(quiz: ExtendedQuiz, img: File): Observable<ExtendedQuiz> {
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

    const formData = new FormData();
    formData.append("obj", JSON.stringify(quizInfo));
    if(img !== undefined && img !== null){
      formData.append("img",img, img.name);
    }

    console.log(quizInfo);
    return this.http.post<ExtendedQuiz>(this.url + 'edit', formData)
      .pipe(map(data => {
        return new ExtendedQuiz().deserialize(data, this.sanitizer);
      }));
  }

  createQuiz(quiz: ExtendedQuiz, img: File): Observable<ExtendedQuiz> {
    const quizInfo = {
      title: quiz.title,
      creatorId: this.user.id,
      language: quiz.language,
      description: quiz.description,
      tagList: quiz.tags.map( a => a.id),
      categoryList: quiz.categories.map( a => a.id)
    };

    const formData = new FormData();
    formData.append("obj", JSON.stringify(quizInfo));
    if(img !== undefined && img !== null){
      formData.append("img",img, img.name);
    }

    console.log(quizInfo);

    return this.http.post<ExtendedQuiz>(this.url, formData);
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
      return new Category(x.category_id, x.title);
    })));;
  }


  quizValidator(quiz: ExtendedQuiz) : string[] {
    let res: string[] = [];

    if (quiz.title.trim().length < 2) {
      res.push("Quiz title must be at least 2 symbol length");
    }

    if (quiz.description.trim().length < 2) {
      res.push("Description must be at least 2 symbol length");
    }

    if (quiz.tags.length == 0){
      res.push("You must add at least one tag");
    }

    if (quiz.categories.length == 0){
      res.push("You must add at least one category");
    }

    return res;
  }

  canIEditQuiz(id: string){
    return id === this.user.id;
  }


  uploadImage(data: FormData) {
    console.log(data);
    return this.http.post(this.url + 'quiz-image', data);
  }

}
