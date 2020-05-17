import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
export class GameConnectorComponent implements OnInit, OnDestroy {
  connectUrl = `${location.origin}/join/`;
  mockImageUrl = '../../assets/img/nopicture.jpg';
  sseGameConnectorUrl = `${environment.apiUrl}sse/stream/`;

  game: Game;
  // TODO add type
  sessions = [];
  usersSessionsReady: string[] = [];
  creator: boolean;
  ready: boolean;
  sessionId: string;

  started: boolean;

  constructor(private activateRoute: ActivatedRoute,
              private gameSettingsService: GameSettingsService,
              private router: Router,
              private sseService: SseService,
              private authenticationService: AuthenticationService,
              private messageModal: ModalMessageService) {
  }

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionid');
    if (this.authenticationService.currentUserValue
      && this.authenticationService.currentUserValue.role !== Role.User
      && this.sessionId) {
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
    this.getSessions(gameId);
  }

  getSessions(gameId: string) {
    this.gameSettingsService.getSessions(gameId)
      .subscribe(ses => {
          Object.assign(this.sessions, ses);
          for (const session of this.sessions) {
            if (this.sessionId === session.game_session_id) {
              this.creator = session.is_creator;
            }
          }
          console.log(this.creator);
          console.log(this.sessions);
          console.log(this.sessionId);
        },
        error => {
          console.log(error)
        });
  }

  setReady() {
    this.ready = true;
    console.log(this.sessionId);
    this.gameSettingsService.setReady(this.game.id, this.sessionId).subscribe();
  }

  startGame() {
    this.started = true;
    this.gameSettingsService.startGame(this.game.id).subscribe(next => {
      console.log(next);
    });
  }

  private subscribeToUsersReady(gameId: string) {
    this.sseService.getServerSentEvent(this.sseGameConnectorUrl + gameId, 'ready')
      .subscribe(next => {
          console.log('Ready ' + next.data);
          if (!this.usersSessionsReady.includes(next.data)) {
            this.usersSessionsReady.push(next.data);
            console.log(this.usersSessionsReady);
          }
          this.ready = this.usersSessionsReady.includes(this.sessionId);
        }
      );
  }

  private subscribeToGameStart(gameId: string) {
    console.log('GAME ID ' + gameId);
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
        this.getSessions(gameId);
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    // this.gameSettingsService.quitGame(this.sessionId);
  }

  ngOnDestroy(): void {
    // this.gameSettingsService.quitGame(this.sessionId);
  }

}
