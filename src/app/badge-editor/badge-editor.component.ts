import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { QuizService } from '../_services/quiz.service';
import { TagCatg } from '../_models/tagcateg';
import { Tag } from '../_models/tag';
import { Category } from '../_models/category';

@Component({
  selector: 'app-badge-editor',
  templateUrl: './badge-editor.component.html',
  styleUrls: ['./badge-editor.component.css']
})
export class BadgeEditorComponent implements OnInit {
  
  @Input()
  label: string;

  @Input()
  tagCateg: TagCatg[];

  model: TagCatg;

  allObjects: TagCatg[];


  
  constructor(private quizService: QuizService) { 
  }

  ngOnInit(): void {
    this.allObjects = [];
    if(this.isTag()){
      this.mapAllTagsOrCategs(this.quizService.getTagsList())
    }else{
      this.mapAllTagsOrCategs(this.quizService.getCategoriesList())
    }
    
  }

  mapAllTagsOrCategs(ans: Observable<any>){
    ans.subscribe(
      ans => ans.forEach( (element) => {
        this.allObjects.push(element);
    }), 
    err => console.log(err));
  }

  remove(i) {
    this.tagCateg.splice(i,1);
  }

  add(){
    const index = this.tagCateg.findIndex( el => el.id === this.model.id);

    if(this.model !== undefined && index === -1){
      if(this.isTag()){
        this.tagCateg.push(new Tag(this.model.id, this.model.description));
      }else{
        this.tagCateg.push(new Category(this.model.id, this.model.description));
      }
      this.model = undefined;
    }
  }

  isTag(){
    return this.label === "Tags";
  }


  formatter = (object: any) => object.description;

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 1),
    map(term => this.allObjects.filter(x => new RegExp(term, 'mi').test(x.description)).slice(0, 10))
  )


}
