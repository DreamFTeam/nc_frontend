import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ExtendedQuestion } from '../_models/question/extendedquestion';
import { DomSanitizer } from '@angular/platform-browser';
import { Temp } from '../_models/temp';

@Component({
  selector: 'app-question-editor-selector',
  templateUrl: './question-editor-selector.component.html',
  styleUrls: ['./question-editor-selector.component.css']
})
export class QuestionEditorSelectorComponent implements OnInit {

  temp: Temp[];

  @Input()
  question: ExtendedQuestion;

  @Input()
  available: boolean;

  @Input()
  thumbnail: any;



  constructor() {
    
    if(this.question !== undefined 
      && this.question.imageContent !== "" ){
      this.thumbnail = this.question.imageContent;
      }
  }

  ngOnChanges() {
    console.log("change");

    this.temp = [];

    this.temp.push({
      rightOptions:[""],
      otherOptions:[""]
    })
    this.temp.push({
      rightOptions:["true"],
      otherOptions:["false"]
    });
    this.temp.push({
      rightOptions:[""],
      otherOptions:[]
    })
    this.temp.push({
      rightOptions:["","",""],
      otherOptions:[]
    })
  }

  ngOnInit(): void {
    
  }

  //Changed question type
  onChange(deviceValue) {
    
    //Save question in temp
    this.temp[this.question.typeId-1].rightOptions = (this.question.rightOptions);
    this.temp[this.question.typeId-1].otherOptions = (this.question.otherOptions);

    //Change question type
    this.question.typeId = parseInt(deviceValue);
    
    //Reinit from temp 
    this.question.rightOptions = (this.temp[this.question.typeId-1].rightOptions);
    this.question.otherOptions = (this.temp[this.question.typeId-1].otherOptions);
  }

  questionImage(e){
    if (e.target.files[0] !== null && e.target.files[0] !== undefined) {
      this.question.unsanitizedImage = e.target.files[0];
      this.setImage(this.question.unsanitizedImage);
    }
  }

  setImage(file: File){
    let reader = new FileReader();
    reader.readAsDataURL(this.question.unsanitizedImage);
    reader.onload = () => {
      this.thumbnail = reader.result;
    }
  }

  removeImage(){
    this.question.unsanitizedImage = null;
    this.thumbnail = null;
  }

  isOneToFour() { return this.question.typeId === 1; }
  isTrueFalse() { return this.question.typeId === 2; }
  isOpenAnswer() { return this.question.typeId === 3; }
  isSequenceAnswer() { return  this.question.typeId === 4; }

}
