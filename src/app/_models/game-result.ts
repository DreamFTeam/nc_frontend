export interface GameResult {
  game_session_id: string;
  user_id: string;
  username: string;
  score: number;
  _winner: boolean;
  _creator: boolean;
  duration_time: number;
}
