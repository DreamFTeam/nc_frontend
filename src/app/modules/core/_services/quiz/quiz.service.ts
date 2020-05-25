import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Quiz } from '../../_models/quiz';
import { User } from '../../_models/user';
import { ExtendedQuiz } from '../../_models/extended-quiz';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Category } from '../../_models/category';
import { Tag } from '../../_models/tag';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Alert } from '../../_models/alert';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  url = `${environment.apiUrl}quizzes`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  user: User;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
              private authenticationService: AuthenticationService) {
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
      newTagList: quiz.tags.map( a => a.id),
      newCategoryList: quiz.categories.map( a => a.id)
    };

    const formData = new FormData();
    formData.append("obj", JSON.stringify(quizInfo));
    if(img !== undefined && img !== null){
      formData.append("img",img, img.name);
    }

    return this.http.post<ExtendedQuiz>(this.url + '/edit', formData)
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
    
    return this.http.post<ExtendedQuiz>(this.url, formData);
  }


  getQuiz(quizId: string): Observable<ExtendedQuiz> {
    let params = new HttpParams().set('quizId', quizId);

    if(this.user){
      params.set('userId',this.user.id);
    }

    const options = {
      params: params
    };

    return this.http.get<ExtendedQuiz>(this.url, options)
      .pipe(map(data => {
        return new ExtendedQuiz().deserialize(data, this.sanitizer);
      }));
  }

  markAsFavorite(id: string) {
    const favoriteInfo = {
      quizId: id,
      userId: this.user.id,
    };

    return this.http.post<Quiz>(this.url + '/markasfavourite', JSON.stringify(favoriteInfo), this.httpOptions);
  }


  publishQuiz(id: string) {
    const quizInfo = {
      quizId: id
    };

    return this.http.post<ExtendedQuiz>(this.url + '/markaspublished', JSON.stringify(quizInfo), this.httpOptions);
  }

  delete(id: string){
    return this.http.delete(this.url+"/"+id);
  }

  deactivate(id: string){
    return this.http.post(this.url + '/deactivate/'+id, null);
  }

  getTagsList(): Observable<Tag[]>{

    return this.http.get<any[]>(this.url+"/tags")
    .pipe(map(data => data.map(x => {
      return new Tag(x.tag_id, x.description);
    })));
  }

  getCategoriesList() : Observable<Category[]>{

    return this.http.get<any[]>(this.url+"/categories")
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
}
