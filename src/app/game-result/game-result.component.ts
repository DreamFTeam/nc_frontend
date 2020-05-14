import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GameSession} from "../_models/game-session";
import {GameResultService} from "../_services/game-result.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GameResultComponent implements OnInit {

  results: any[];
  gameId: string;
  maxPoints: number;
  winner: string;
  view = [600, 400];
  gameResults: GameSession[];


  // colorScheme = {
  //   domain: ['#e5de09', '#9e0505', '#05b4ff', '#FF5005']
  // };

  constructor(private gameResultService: GameResultService, private router: ActivatedRoute) {
    this.gameId = this.router.snapshot.paramMap.get("id");
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit(): void {
    this.gameResultService.getResults(this.gameId).subscribe(gameSessions => {
      this.gameResults = gameSessions;
      this.findWinner(this.gameResults);
      this.results = gameSessions.map(gameSessions => {
        gameSessions.username, gameSessions.score;
      })
    });
  }

  findWinner(gameSessions: GameSession[]): void {
    this.winner = gameSessions.filter(gameSessions => gameSessions.winner)[0].username;
  }

}
