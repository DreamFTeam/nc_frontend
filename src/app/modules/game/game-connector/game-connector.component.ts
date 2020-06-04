import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameSettingsService} from '../../core/_services/game/game-settings.service';
import {Game} from '../../core/_models/game';
import {SseService} from '../../core/_services/utils/sse.service';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {Role} from '../../core/_models/role';
import {ModalMessageService} from '../../core/_services/utils/modal-message.service';
import {AnonymService} from '../../core/_services/game/anonym.service';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import {LocaleService} from '../../core/_services/utils/locale.service';
import {ModalService} from '../../core/_services/utils/modal.service';


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
    location = location.origin;
    loggedIn: boolean;

    started: boolean;
    faSpinner = faSpinner;
    private sessionsSubscription: Subscription;
    private readySubscription: Subscription;
    gameStatus: string;

    constructor(private activateRoute: ActivatedRoute,
                private gameSettingsService: GameSettingsService,
                private router: Router,
                private sseService: SseService,
                private authenticationService: AuthenticationService,
                private messageModal: ModalMessageService,
                private toastsService: ToastsService,
                private anonymService: AnonymService,
                private localeService: LocaleService,
                private modalService: ModalService) {
        this.loggedIn = !!this.authenticationService.currentUserValue;
        this.sessionId = localStorage.getItem('sessionid');
    }

    ngOnInit(): void {
        if (this.authenticationService.currentUserValue
            && this.authenticationService.currentUserValue.role !== Role.User
            || !this.sessionId) {
            this.messageModal.show(this.localeService.getValue('game.accessDen'), this.localeService.getValue('game.permissions'));
            this.router.navigateByUrl('/');
        }
        const gameId = this.activateRoute.snapshot.paramMap.get('id');
        this.gameSettingsService.getSseForGame(gameId);
        this.gameSettingsService
            .getGame(gameId)
            .pipe(first())
            .subscribe(game => {
                    if (!game.accessId) {
                        this.messageModal.show(this.localeService.getValue('game.accessDen'), this.localeService.getValue('game.gameStarted'));
                        this.router.navigateByUrl('/');
                    }
                    this.game = game;
                    this.gameStatus = this.localeService.getValue('game.waitingpl');
                }
            );
        this.gameSettingsService.setSubjSessions(gameId);

        this.sessionsSubscription = this.gameSettingsService.sessions
            .subscribe(ses => {
                this.sessions = [];
                Object.assign(this.sessions, ses);
                for (const session of this.sessions) {
                    if (this.sessionId === session.game_session_id) {
                        this.creator = session._creator;
                    }
                }
                if (this.game && ses.length === this.game.maxUsersCount) {
                    this.gameStatus = this.localeService.getValue('game.hostStart');
                }
            });
        this.readySubscription = this.gameSettingsService.readyList.subscribe(ready => {
            Object.assign(this.usersSessionsReady, ready);
            console.log(ready);
            this.ready = this.usersSessionsReady.includes(this.sessionId);
        });
    }

    setReady() {
        this.ready = true;
        this.gameSettingsService.setReady(this.game.id, this.sessionId).pipe(first()).subscribe();
    }

    startGame() {
        this.started = true;
        this.gameSettingsService.startGame(this.game.id).pipe(first()).subscribe();
    }

    copyInputMessage(inputElement) {
        inputElement.value = this.connectUrl + inputElement.value;
        inputElement.select();
        document.execCommand('copy');
        inputElement.value = this.game.accessId;
        this.toastsService.removeAll();
        this.toastsService.toastAddSuccess(this.localeService.getValue('game.urlCopied'));
    }


    @HostListener('window:beforeunload', ['$event'])
    ngOnDestroy(): void {
        console.log('destroy');
        this.sessionsSubscription.unsubscribe();
        this.readySubscription.unsubscribe();
        this.gameSettingsService.stopSse();
        // if (!this.gameSettingsService.gameStart) {
        //     this.gameSettingsService.quitGame(this.sessionId).pipe(first()).subscribe();
        //     localStorage.removeItem('sessionid');
        //     if (this.anonymService.currentAnonymValue) {
        //         this.anonymService.removeAnonym();
        //     }
        // }
    }

    remove(sessionId: string) {
        this.modalService.openModal(sessionId === this.sessionId ? this.localeService.getValue('game.askLeft') :
            this.localeService.getValue('game.askLeftHost'), 'danger').pipe(first())
            .subscribe(yes => {
                if (yes) {
                    this.gameSettingsService.removeSession(sessionId).pipe(first()).subscribe();
                    if (sessionId === this.sessionId) {
                        this.router.navigateByUrl('/quiz-list');
                    }
                }
            });

    }
}
