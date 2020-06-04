import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Game} from '../../_models/game';
import {SseService} from '../utils/sse.service';
import {GameSession} from '../../_models/game-session';
import {catchError, map} from 'rxjs/operators';
import {HandleErrorsService} from '../utils/handle-errors.service';
import {AnonymService} from './anonym.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageModalComponent} from '../../../authorization/message-modal/message-modal.component';
import {LocaleService} from '../utils/locale.service';

@Injectable({
    providedIn: 'root'
})
export class GameSettingsService {
    gameUrl = `${environment.apiUrl}games/`;

    private sessionsSubject: BehaviorSubject<any[]>;
    public sessions: Observable<any[]>;
    private readySubject: BehaviorSubject<string[]>;
    public readyList: Observable<string[]>;

    private eventSource: EventSource;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient,
                private sseService: SseService,
                private errorsService: HandleErrorsService,
                private anonymService: AnonymService,
                private router: Router,
                private sanitizer: DomSanitizer,
                private modalService: NgbModal,
                private localeService: LocaleService) {
        this.sessionsSubject = new BehaviorSubject<any[]>([]);
        this.sessions = this.sessionsSubject.asObservable();
        this.readySubject = new BehaviorSubject<string[]>([]);
        this.readyList = this.readySubject.asObservable();
    }

    getSseForGame(gameId: string) {
        this.eventSource = this.sseService.getEventSource(this.gameUrl + 'subscribe/' + gameId);
        this.eventSource.addEventListener('join', () => {
            this.setSubjSessions(gameId);
        });

        this.eventSource.addEventListener('remove', event => {
            const id: any = event;
            if (id.data === localStorage.getItem('sessionid')) {
                this.leftGame(this.localeService.getValue('game.kickBody'));
            } else {
                this.setSubjSessions(gameId);
            }
        });

        this.eventSource.addEventListener('ready', event => {
            const ev: any = event;
            if (!this.readySubject.value.includes(ev.data)) {
                this.readySubject.value.push(ev.data);
                this.readySubject.next(this.readySubject.value);
            }
        });

        this.eventSource.addEventListener('start', () => {
            this.readySubject.next([]);
            this.sessionsSubject.next([]);
            this.router.navigateByUrl(`/play/${gameId}`);
        });

        this.eventSource.addEventListener('left', () =>
            this.leftGame(this.localeService.getValue('game.hostLeftBody')));

        this.eventSource.onerror = error => {
            console.error(error);
        };

    }

    private leftGame(modalBody: string) {
        this.readySubject.next([]);
        this.sessionsSubject.next([]);
        this.router.navigateByUrl('/quiz-list');
        const modalRef = this.modalService.open(MessageModalComponent);
        modalRef.componentInstance.title = this.localeService.getValue('game.leftTitle');
        modalRef.componentInstance.body = modalBody;

    }

    stopSse() {
        this.eventSource.close();
    }

    createGame(settings: any): Observable<Game> {
        if (!settings.additionalPoints) {
            settings.additionalPoints = false;
        }
        // console.log(settings);
        return this.http.post<Game>(this.gameUrl, JSON.stringify(settings), this.httpOptions);
    }

    getGame(gameId: string): Observable<Game> {
        return this.http.get<Game>(this.gameUrl + `game/${gameId}`, this.httpOptions);
    }

    join(accessId: string): Observable<GameSession> {
        return this.http.get<GameSession>(this.gameUrl + `join/${accessId}`,
            this.httpOptions);
    }

    getSessions(gameId: string): Observable<any> {
        return this.http.get<any>(this.gameUrl + `sessions/${gameId}`, this.httpOptions).pipe(
            map(sessions => {
                sessions.forEach(x => {
                    x.imageContent = this.imageDeser(x.image);
                });
                return sessions;
            })
        );
    }

    setSubjSessions(gameId: string) {
        this.getSessions(gameId).subscribe(ses => this.sessionsSubject.next(ses));
    }

    setReady(gameId: string, sessionId: string) {
        return this.http.patch(this.gameUrl + `game/${gameId}/ready`, {},
            {headers: this.httpOptions.headers, params: {sessionId}})
            .pipe(catchError(this.errorsService.handleError('setReady')));
    }

    startGame(gameId: string): Observable<any> {
        return this.http.patch(this.gameUrl + `start`, null,
            {headers: this.httpOptions.headers, params: {gameId}})
            .pipe(catchError(this.errorsService.handleError('startGame')));
    }

    removeSession(sessionId: string) {
        return this.http.delete(this.gameUrl + `remove/${sessionId}`, this.httpOptions)
            .pipe(
                catchError(this.errorsService.handleError('quitGame'))
            );
    }

    private imageDeser(image) {
        if (image) {
            const objUrl = 'data:image/jpeg;base64,' + image;
            image = this.sanitizer.bypassSecurityTrustUrl(objUrl);
        }
        return image;
    }

    getFinishSubs(gameId: string): Observable<any> {
        return this.sseService.getServerSentEvent(this.gameUrl + 'subscribe/' + gameId, 'finished');
    }
}
