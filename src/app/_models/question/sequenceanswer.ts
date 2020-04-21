import {Question} from './question';

export class SequenceAnswer implements Question{
 
    id: number;
    title: string;
    answers: string[] = [];
    constructor(id: number, title: string, answers: string[]) {
        this.id = id;
        this.title = title;
        this.answers = answers;
    }
    
}