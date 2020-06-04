import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../../core/_services/quiz/question.service';
import {GameSettingsService} from '../../core/_services/game/game-settings.service';
import {LocaleService} from '../../core/_services/utils/locale.service';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-game-settings',
    templateUrl: './game-settings.component.html',
    styleUrls: ['./game-settings.component.css']
})
export class GameSettingsComponent implements OnInit {
    readonly roundDurations = ['10', '30', '60', '90', '120'];
    readonly minQuestion = 4;
    readonly maxUser = 10;
    readonly breaks = ['0', '3', '5', '10', '30'];

    quizId: string;
    errorMessage: string;
    questionsAmount: number;
    loading: boolean;

    constructor(private activateRoute: ActivatedRoute,
                private questionService: QuestionService,
                private gameSettingsService: GameSettingsService,
                private router: Router,
                private localeService: LocaleService) {
    }

    ngOnInit(): void {
        this.quizId = this.activateRoute.snapshot.paramMap.get('id');
        this.questionService.questionsTotalSize(this.quizId).pipe(first())
            .subscribe(data => this.questionsAmount = data);
        this.loading = false;
    }

    applySettings(settings: any): void {
        if (settings.numberOfQuestions < this.minQuestion) {
            this.errorMessage = this.localeService.getValue('game.minQuesError');
            return;
        }

        if (settings.numberOfQuestions > this.questionsAmount) {
            this.errorMessage = this.localeService.getValue('game.questAmountError') + this.questionsAmount;
            return;
        }

        if (settings.maxUsersCount < 1) {
            this.errorMessage = this.localeService.getValue('game.minUserError');
            return;
        }

        if (settings.maxUsersCount > this.maxUser) {
            this.errorMessage = this.localeService.getValue('game.maxUserError') + this.maxUser;
            return;
        }
        settings.quizId = this.quizId;
        this.gameSettingsService.createGame(settings).pipe(first()).subscribe(
            game => {
                this.router.navigateByUrl(`join/${game.accessId}`);
            }
        );
        this.loading = true;
    }

}
