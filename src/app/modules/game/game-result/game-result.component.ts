import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RatingQuizModalComponent} from '../rating-quiz-modal/rating-quiz-modal.component';
import {GameResult} from '../../core/_models/game-result';
import {GameResultService} from '../../core/_services/game/game-result.service';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {AnonymService} from '../../core/_services/game/anonym.service';


@Component({
    selector: 'app-game-result',
    templateUrl: './game-result.component.html',
    styleUrls: ['./game-result.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GameResultComponent implements OnInit, OnDestroy {

    results: GameResult[];
    gameId: string;
    winner: string;
    resultsForGraphic: any[];
    loggedIn: boolean;

    constructor(private gameResultService: GameResultService,
                private activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private authenticationService: AuthenticationService,
                private anonymService: AnonymService
    ) {
        this.gameId = this.activatedRoute.snapshot.paramMap.get('id');
    }

    onSelect(event) {
        console.log(event);
    }

    ngOnInit(): void {
        this.loggedIn = !!this.authenticationService.currentUserValue;
        this.gameResultService.getResults(this.gameId)
            .subscribe(ses => {
                this.results = ses;
                this.setResultsForGraphic(ses);
                this.findWinner(ses);
            });

    }

    findWinner(gameResults: GameResult[]): void {
        this.winner = gameResults.filter(result => result._winner)[0].username;
    }

    setResultsForGraphic(gameResults: GameResult[]) {
        this.resultsForGraphic = [];
        gameResults.forEach(result => {
            this.resultsForGraphic.push({name: result.username, value: result.score});
        });
    }

    rateModal() {
        const modal = this.modalService.open(RatingQuizModalComponent);
        modal.componentInstance.gameId = this.gameId;
    }

    ngOnDestroy(): void {
        if (this.anonymService.currentAnonymValue) {
            this.anonymService.removeAnonym();
        }
    }
}
