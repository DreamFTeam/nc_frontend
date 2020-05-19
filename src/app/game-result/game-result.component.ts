import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GameResultService} from '../_services/game-result.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GameResult} from '../_models/game-result';


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

    // colorScheme = {
    //   domain: ['#e5de09', '#9e0505', '#05b4ff', '#FF5005']
    // };

    constructor(private gameResultService: GameResultService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.gameId = this.activatedRoute.snapshot.paramMap.get('id');
    }

    onSelect(event) {
        console.log(event);
    }

    ngOnInit(): void {

        this.gameResultService.getResults(this.gameId)
            .subscribe(ses => {
                this.results = ses;
                this.setResultsForGraphic(ses);
                this.findWinner(ses);
            });

    }

    findWinner(gameResults: GameResult[]): void {
        this.winner = gameResults.filter(result => result.is_winner)[0].username;
    }

    setResultsForGraphic(gameResults: GameResult[]) {
        this.resultsForGraphic = [];
        gameResults.forEach(result => {
            this.resultsForGraphic.push({name: result.username, value: result.score});
        });
    }

}
