export interface GameSession {
  id: string;
  userId: string;
  username: string;
  gameId: string;
  score: number;
  winner: boolean;
  creator: boolean;
  savedByUser: boolean;
  durationTime: number;
}
