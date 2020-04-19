export interface Quiz {
    id: string;
    title: string;
    description: string;
    imageReference: string;
    creationDate: Date;
    creatorId: string;
    activated: boolean;
    validated: boolean;
    quizLanguage: string;
    adminCommentary: string;
    rating: number;
  }