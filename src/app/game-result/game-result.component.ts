import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GameSession} from '../_models/game-session';
import {GameResultService} from '../_services/game-result.service';
import {ActivatedRoute} from '@angular/router';


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
  gameResults = [];


  // colorScheme = {
  //   domain: ['#e5de09', '#9e0505', '#05b4ff', '#FF5005']
  // };

  constructor(private gameResultService: GameResultService, private router: ActivatedRoute) {
    this.gameId = this.router.snapshot.paramMap.get('id');
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit(): void {
    this.gameResultService.getResults(this.gameId).subscribe(gameSessions => {
      console.log(gameSessions)
      Object.assign(this.gameResults, gameSessions);
      this.findWinner(this.gameResults);
      this.results = this.gameResults.map(gameSession => {
        return {
          username: gameSession.username ? gameSession.username : 'anonym',
          value: gameSession.score
        };
      });
      console.log(this.results);
    });
  }

  findWinner(gameSessions): void {
    this.winner = gameSessions.filter(gameSession => gameSession.is_winner)[0].username;
  }

}
