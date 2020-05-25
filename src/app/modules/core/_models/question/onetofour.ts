import {Question} from './question';

export class OneToFour implements Question {

    id: string;
    title: string;
    content: string;
    image: Blob;
    points: number;
    quizId: string;
    typeId: number;

    answers: string[] = [];
    rightAnswers: boolean[] = [];

    constructor(id: string, title: string, content: string,
                image: Blob, points: number, quizId: string, typeId: number,
                answers: string[], rightAnswers: boolean[]) {
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
