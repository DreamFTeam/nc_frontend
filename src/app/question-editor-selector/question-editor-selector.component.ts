import { Component, OnInit, Input } from '@angular/core';
import { ExtendedQuestion } from '../_models/question/extendedquestion';

@Component({
  selector: 'app-question-editor-selector',
  templateUrl: './question-editor-selector.component.html',
  styleUrls: ['./question-editor-selector.component.css']
})
export class QuestionEditorSelectorComponent implements OnInit {

  @Input()
  question: ExtendedQuestion;

  @Input()
  formData: FormData

  @Input()
  thumbnail: any;

  file: File;

   

  constructor() {
    if(this.question !== undefined 
      && this.question.imageContent !== "" ){
      this.thumbnail = this.question.imageContent;
      }
  }

  ngOnInit(): void {
    
  }

  //Changed question type
  onChange(deviceValue) {
    this.question.typeId = parseInt(deviceValue);
    switch (this.question.typeId) {
      case 1: {
        this.question.rightOptions = [""];
        this.question.otherOptions = [""];
        break;
      }
      case 2: {
        this.question.rightOptions = ["true"];
        this.question.otherOptions = ["false"];
        break;
      }
      case 3: {
        this.question.rightOptions = [""];
        this.question.otherOptions = [];
        break;
      }
      case 4: {
        this.question.otherOptions = ["","",""];
        this.question.otherOptions = [];
        break;
      }
    }
  }

  questionImage(e){
    this.file = e.target.files[0];
    this.setImage(this.file);
    this.formData.set("img",this.file);
    console.log(this.formData.get("questionId"))
  }

  setImage(file: File){
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.thumbnail = reader.result;
    }
  }

  isOneToFour() { return this.question.typeId === 1; }
  isTrueFalse() { return this.question.typeId === 2; }
  isOpenAnswer() { return this.question.typeId === 3; }
  isSequenceAnswer() { return  this.question.typeId === 4; }

}
