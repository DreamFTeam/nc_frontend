import {Question} from './question';

export class SequenceAnswer implements Question{
 
    id: string;
    title: string;
    content: string;
    image: Blob;
    points: number;
    quizId: string;
    typeId: number;

    rightAnswers: string[] = [];

    constructor(id: string, title: string, content: string,
         image: Blob, points: number, quizId: string, 
         typeId: number, rightAnswers: string[]) {
            this.id = id;
            this.title = title;
            this.content = content;
            this.image = image;
            this.points = points;
            this.quizId = quizId;
            this.typeId = typeId;
        
            this.rightAnswers = rightAnswers;
    }
    
}