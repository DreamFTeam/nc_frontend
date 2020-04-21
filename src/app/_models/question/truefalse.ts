import {Question} from './question';

export class TrueFalse implements Question{
 
    id: number;
    title: string;
    rightAnswer: boolean;
    constructor(id: number, title: string, rightAnswer: boolean) {
        this.id = id;
        this.title = title;
        this.rightAnswer = rightAnswer;
    }
}