import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {GameResultService} from '../_services/game-result.service';
import {GameQuestionService} from '../_services/game-question.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-rating-quiz-modal',
    templateUrl: './rating-quiz-modal.component.html',
    styleUrls: ['./rating-quiz-modal.component.css']
})
export class RatingQuizModalComponent implements OnInit, OnDestroy {
    currentRate: number;
    message: string;
    readonly alreadyRateMes = 'You have already rated this quiz before. You can change your mind now.';
    readonly notRatedYetMes = 'Rate quiz please';
    @Input() gameId: string;
    private quizId: string;

    constructor(public activeModal: NgbActiveModal,
                private gameResultService: GameResultService,
                private gameQuestionService: GameQuestionService) {
    }

    ngOnInit(): void {
        console.log(this.gameId);
        this.gameQuestionService.getGameData(this.gameId).subscribe(x => {
            this.quizId = x.quizId;
            this.gameResultService.getRating(this.quizId).subscribe(rating => {
                this.currentRate = rating.rating;
                this.message = this.currentRate ? this.alreadyRateMes : this.notRatedYetMes;
            });
        });
    }

    ngOnDestroy(): void {
        this.gameResultService.sendRating(this.gameId, this.currentRate).subscribe();
    }

}
