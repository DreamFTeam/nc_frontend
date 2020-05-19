import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameSettingsService} from '../_services/game-settings.service';
import {Game} from '../_models/game';
import {SseService} from '../_services/sse.service';
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
        this.gameSettingsService.getSseForGame(gameId);
        this.gameSettingsService.setSubjSessions(gameId);
        this.gameSettingsService.sessions.subscribe(ses => {
            Object.assign(this.sessions, ses);
            for (const session of this.sessions) {
                if (this.sessionId === session.game_session_id) {
                    this.creator = session.is_creator;
                }
            }
        });
        this.gameSettingsService.readyList.subscribe(ls => {
            Object.assign(this.usersSessionsReady, ls);
            console.log(ls);
            this.ready = this.usersSessionsReady.includes(this.sessionId);
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


    @HostListener('window:beforeunload', ['$event'])
    ngOnDestroy(): void {
        console.log('destroy')
        if (!this.gameSettingsService.gameStart) {
            this.gameSettingsService.quitGame(this.sessionId).subscribe();
            localStorage.removeItem('sessionid');
        }
    }

}
