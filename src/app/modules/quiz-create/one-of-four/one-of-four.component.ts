import {Component, Input, OnInit} from '@angular/core';
import {ExtendedQuestion} from '../../core/_models/question/extendedquestion';

@Component({
    selector: 'app-one-of-four',
    templateUrl: './one-of-four.component.html',
    styleUrls: ['./one-of-four.component.css']
})
export class OneOfFourComponent implements OnInit {
    @Input() question: ExtendedQuestion;

    @Input()
    available: boolean;

    constructor() {
    }

    ngOnInit(): void {
    }

    addRight() {
        this.question.rightOptions.push('');
    }

    addOther() {
        this.question.otherOptions.push('');
    }


    removeRight(i) {
        this.question.rightOptions.splice(i, 1);
    }

    removeOther(i) {
        this.question.otherOptions.splice(i, 1);
    }

    trackByFn(index: any, item: any) {
        return index;
    }

    onChange(event, answer) {
        console.log(event + ' ' + answer);
    }


    isLimitReached() {
        return (this.question.rightOptions.length + this.question.otherOptions.length != 4) && this.available;
    }

    isRemovableRight() {
        return this.question.rightOptions.length > 1 && this.available;
    }

    isRemovableOther() {
        return this.question.otherOptions.length > 1 && this.available;
    }


}
