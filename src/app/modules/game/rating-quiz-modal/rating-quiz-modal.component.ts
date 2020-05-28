import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {GameResultService} from '../../core/_services/game/game-result.service';
import {GameQuestionService} from '../../core/_services/game/game-question.service';
import {LocaleService} from '../../core/_services/utils/locale.service';

@Component({
    selector: 'app-rating-quiz-modal',
    templateUrl: './rating-quiz-modal.component.html',
    styleUrls: ['./rating-quiz-modal.component.css']
})
export class RatingQuizModalComponent implements OnInit, OnDestroy {
    currentRate: number;
    message: string;
    readonly alreadyRateMes = this.localeService.getValue('rating.alreadyRateMes');
    readonly notRatedYetMes = this.localeService.getValue('rating.notRatedYetMes');
    @Input() gameId: string;
    private quizId: string;

    constructor(public activeModal: NgbActiveModal,
                private gameResultService: GameResultService,
                private gameQuestionService: GameQuestionService,
                private localeService: LocaleService) {
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
