import {Question} from './question';

export class TrueFalse implements Question{
 
    id: string;
    title: string;
    content: string;
    image: Blob;
    points: number;
    quizId: string;
    typeId: number;

    answer: string ;
    rightAnswer: string;
    
    constructor(id: string, title: string, content: string,
         image: Blob, points: number, quizId: string, typeId: number,
         answer: string, rightAnswer: string) {
            this.id = id;
            this.title = title;
            this.content = content;
            this.image = image;
            this.points = points;
            this.quizId = quizId;
            this.typeId = typeId;
        
            this.answer = answer;
            this.rightAnswer = rightAnswer;
    }
}