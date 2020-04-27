export interface Question {
    id: string;
    title: string;
    content: string;
    image: Blob;
    points: number;
    quizId: string;
    typeId: number;
  }