import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../_services/question.service';
import {GameSettingsService} from '../_services/game-settings.service';
import {Game} from '../_models/game';
import {SseService} from '../_services/sse.service';
import {environment} from '../../environments/environment';
import {AuthenticationService} from '../_services/authentication.service';

@Component({
  selector: 'app-game-connector',
  templateUrl: './game-connector.component.html',
  styleUrls: ['./game-connector.component.css']
})
export class GameConnectorComponent implements OnInit {
  connectUrl = `${location.origin}/join/`;
  mockImageUrl = '../../assets/img/nopicture.jpg';
  sseGameConnectorUrl = `${environment.apiUrl}sse/stream/game-connector/`;
  sseUsersReadyUrl = `${environment.apiUrl}sse/stream/users-ready/`;

  game: Game;
  // TODO add type
  users = [];
  usersIdReady: string[] = [];
  creator: boolean;
  ready: boolean;

  constructor(private activateRoute: ActivatedRoute,
              private questionService: QuestionService,
              private gameSettingsService: GameSettingsService,
              private router: Router,
              private sseService: SseService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    const gameId = this.activateRoute.snapshot.paramMap.get('id');
    this.gameSettingsService
      .getGame(gameId)
      .subscribe(game => {
        this.game = game;
      });

    this.sseService.getServerSentEvent(this.sseGameConnectorUrl + gameId)
      .subscribe(next => {
          const user = JSON.parse(next.data);
          // Todo check dupl
          this.users.push(user);
          console.log(JSON.parse(next.data));
        }
        // this.getUsers(game.id)
      );

    this.sseService.getServerSentEvent(this.sseUsersReadyUrl + gameId)
      .subscribe(next => {
          const id = JSON.parse(next.data).id;
          // Todo check dupl
          this.usersIdReady.push(id);
          this.ready = this.usersIdReady.includes(this.authenticationService.currentUserValue.id);
          console.log(JSON.parse(next.data));
        }
        // this.getUsers(game.id)
      );
    // this.subscribeOnEvents()
  }


  getUsers(gameId: string) {
    this.gameSettingsService.getUsers(gameId)
      .subscribe(us => {
        // Object.assign(this.users, us);
        console.log(us);
      });
  }

  setReady() {
    this.gameSettingsService.setReady(this.game.id).subscribe();
  }

}
