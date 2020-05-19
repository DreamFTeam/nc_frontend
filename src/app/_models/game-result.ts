export interface GameResult {
  game_session_id: string;
  user_id: string;
  username: string;
  score: number;
  is_winner: boolean;
  is_creator: boolean;
  duration_time: number;
}
