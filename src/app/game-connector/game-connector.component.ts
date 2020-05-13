import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../_services/question.service';
import {GameSettingsService} from '../_services/game-settings.service';
import {Game} from '../_models/game';
import {SseService} from '../_services/sse.service';
import {environment} from '../../environments/environment';
import {AuthenticationService} from '../_services/authentication.service';
import {Role} from '../_models/role';
import {ModalMessageService} from '../_services/modal-message.service';


@Component({
  selector: 'app-game-connector',
  templateUrl: './game-connector.component.html',
  styleUrls: ['./game-connector.component.css']
})
export class GameConnectorComponent implements OnInit {
  connectUrl = `${location.origin}/join/`;
  mockImageUrl = '../../assets/img/nopicture.jpg';
  sseGameConnectorUrl = `${environment.apiUrl}sse/stream/`;

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
              private authenticationService: AuthenticationService,
              private messageModal: ModalMessageService) {
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue.role !== Role.User) {
      this.messageModal.show('Access denied', 'You don\'t have permissions.');
      this.router.navigateByUrl('/');
    }
    const gameId = this.activateRoute.snapshot.paramMap.get('id');
    this.gameSettingsService
      .getGame(gameId)
      .subscribe(game => {
          if (!game.accessId) {
            this.messageModal.show('Access denied', 'The game has already started or has not been created.');
            this.router.navigateByUrl('/');
          }
          console.log(game);
          this.game = game;
        }
      );

    this.subscribeOnUsersJoining(gameId);
    this.subscribeToUsersReady(gameId);
    this.subscribeToGameStart(gameId);
  }

  getUsers(gameId: string) {
    this.gameSettingsService.getUsers(gameId)
      .subscribe(us => {
        Object.assign(this.users, us);
        for (const user of this.users) {
          this.creator = user.is_creator
            && this.authenticationService.currentUserValue.id === user.user_id;
        }
        console.log(this.users);
      });
  }

  setReady() {
    this.ready = true;
    this.gameSettingsService.setReady(this.game.id).subscribe();
  }

  startGame() {
    this.gameSettingsService.startGame(this.game.id).subscribe(next => {
    });
  }

  private subscribeToUsersReady(gameId: string) {
    this.sseService.getServerSentEvent(this.sseGameConnectorUrl + gameId, 'ready')
      .subscribe(next => {
          console.log('Ready ' + next.data);
          if (!this.usersIdReady.includes(next.data)) {
            this.usersIdReady.push(next.data);
            console.log(this.usersIdReady);
          }
          this.ready = this.usersIdReady.includes(this.authenticationService.currentUserValue.id);
        }
      );
  }

  private subscribeToGameStart(gameId: string) {
    this.sseService.getServerSentEvent(this.sseGameConnectorUrl + gameId, 'start')
      .subscribe(next => {
          console.log(next);
          alert('Game started');
        }
      );
  }

  private subscribeOnUsersJoining(gameId: string) {
    this.sseService.getServerSentEvent(this.sseGameConnectorUrl + gameId, 'join')
      .subscribe(() => {
        console.log('Join');
        // Get user when they not added to db yet
        // TODO
        this.getUsers(gameId);
      });
  }


}
