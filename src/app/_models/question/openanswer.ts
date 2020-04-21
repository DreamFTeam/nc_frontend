import {Question} from './question';

export class OpenAnswer implements Question{
 
    id: number;
    title: string;
    answer: string;
    constructor(id: number, title: string, answer: string) {
        this.id = id;
        this.title = title;
        this.answer = answer;
    }
}