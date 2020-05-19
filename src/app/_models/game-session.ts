export interface GameSession {
    id: string;
    username: string;
    userId: string;
    gameId: string;
    score: number;
    winner: boolean;
    creator: boolean;
    savedByUser: boolean;
    durationTime: number;

}
