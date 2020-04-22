import {Question} from './question';

export class OpenAnswer implements Question{
 
    id: string;
    title: string;
    content: string;
    image: string;
    points: number;
    quizId: string;
    typeId: number;

    rightAnswer: string;
    
    constructor(id: string, title: string, content: string,
         image: string, points: number, quizId: string,
         typeId: number,rightAnswer: string) {
            this.id = id;
            this.title = title;
            this.content = content;
            this.image = image;
            this.points = points;
            this.quizId = quizId;
            this.typeId = typeId;
        
            this.rightAnswer = rightAnswer;
    }
}