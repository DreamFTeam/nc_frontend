import {Question} from './question';

export class OneToFour implements Question{
 
    id: number;
    title: string;
    answers: string[] = [];
    rightAnswers: boolean[] = [];
    constructor(id: number, title: string, answers: string[], rightAnswers: boolean[]) {

        this.id = id;
        this.title = title;
        this.answers = answers;
        this.rightAnswers = rightAnswers;
    }
    

}