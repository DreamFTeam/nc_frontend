import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../_services/question.service';
import {GameSettingsService} from '../_services/game-settings.service';
import {Game} from '../_models/game';
import {User} from '../_models/user';

@Component({
  selector: 'app-game-connector',
  templateUrl: './game-connector.component.html',
  styleUrls: ['./game-connector.component.css']
})
export class GameConnectorComponent implements OnInit {

  game: Game;
  users: User[];

  constructor(private activateRoute: ActivatedRoute,
              private questionService: QuestionService,
              private gameSettingsService: GameSettingsService,
              private router: Router) { }

  ngOnInit(): void {
    this.gameSettingsService
      .getGame(this.activateRoute.snapshot.paramMap.get('id'))
      .subscribe(game => {this.game = game; console.log(game); });
  }


}
