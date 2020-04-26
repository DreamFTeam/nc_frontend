export interface Quiz {
    id: string;
    title: string;
    category: string[];
    tags: string[];
    description: string;
    imageReference: Blob;
    creationDate: Date;
    creatorId: string;
    activated: boolean;
    validated: boolean;
    quizLanguage: string;
    adminCommentary: string;
    rating: number;
    published: boolean;
  }