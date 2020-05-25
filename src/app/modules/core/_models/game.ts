export interface Game {
    id: string;
    startDatetime: Date;
    maxUsersCount: number;
    numberOfQuestions: number;
    roundDuration: number;
    additionalPoints: boolean;
    breakTime: number;
    accessId: string;
    quizId: string;
}
