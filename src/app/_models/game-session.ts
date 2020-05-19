import {DomSanitizer} from "@angular/platform-browser";

export interface GameSession {
  id: string;
  username: string;
  userId: string;
  username: string;
  gameId: string;
  score: number;
  winner: boolean;
  creator: boolean;
  savedByUser: boolean;
  durationTime: number;

}
