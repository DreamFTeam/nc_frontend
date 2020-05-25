import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GameResultService } from '../_services/game-result.service';
import { ActivatedRoute } from '@angular/router';
import { GameResult } from '../_models/game-result';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RatingQuizModalComponent } from '../rating-quiz-modal/rating-quiz-modal.component';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
    selector: 'app-game-result',
    templateUrl: './game-result.component.html',
    styleUrls: ['./game-result.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GameResultComponent implements OnInit {

    results: GameResult[];
    gameId: string;
    maxPoints: number;
    winner: string;
    view = [600, 400];
    resultsForGraphic: any[];
    loggedIn: boolean;

    // colorScheme = {
    //   domain: ['#e5de09', '#9e0505', '#05b4ff', '#FF5005']
    // };

    constructor(private gameResultService: GameResultService,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private authenticationService: AuthenticationService
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
            this.resultsForGraphic.push({ name: result.username, value: result.score });
        });
    }

    rateModal() {
        const modal = this.modalService.open(RatingQuizModalComponent);
        modal.componentInstance.gameId = this.gameId;
    }
}
