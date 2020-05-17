export interface Game {
  id: string;
  startDatetime: Date;
  maxUsersCount: number;
  numberOfQuestions: number;
  roundDuration: number;
  breakTime: number;
  additionalPoints: boolean;
  accessId: string;
  quizId: string;
}
