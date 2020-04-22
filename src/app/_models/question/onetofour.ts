import {Question} from './question';

export class OneToFour implements Question{
 
    id: string;
    title: string;
    content: string;
    image: string;
    points: number;
    quizId: string;
    typeId: number;

    answers: string[] = [];
    rightAnswers: string[] = [];
    
    constructor(id: string, title: string, content: string,
         image: string, points: number, quizId: string, typeId: number,
         answers: string[], rightAnswers: string[]) {
            this.id = id;
            this.title = title;
            this.content = content;
            this.image = image;
            this.points = points;
            this.quizId = quizId;
            this.typeId = typeId;
        
            this.answers = answers;
            this.rightAnswers = rightAnswers;
    }
}