import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../../core/_services/quiz/question.service';
import {GameSettingsService} from '../../core/_services/game/game-settings.service';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';

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
    error: boolean;
    errorMessage: string;
    questionsAmount: number;
    loading: boolean;

    constructor(private activateRoute: ActivatedRoute,
                private questionService: QuestionService,
                private gameSettingsService: GameSettingsService,
                private router: Router,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.quizId = this.activateRoute.snapshot.paramMap.get('id');
        this.questionService.questionsTotalSize(this.quizId).subscribe(
            data => this.questionsAmount = data);
        this.loading = false;
    }

    applySettings(settings: any): void {
        if (settings.numberOfQuestions < this.minQuestion || settings.maxUsersCount < 1) {
            this.error = true;
            this.errorMessage = 'Incorrect data';
            return;
        }
        if (settings.numberOfQuestions > this.questionsAmount) {
            this.error = true;
            this.errorMessage = `Too many questions. There are only ${this.questionsAmount} questions in this quiz. `;
            return;
        }
        if (settings.maxUsersCount > this.maxUser) {
            this.error = true;
            this.errorMessage = `Too many users. Must be less than ${this.maxUser}`;
            return;
        }
        settings.quizId = this.quizId;
        this.gameSettingsService.createGame(settings).subscribe(
            game => {
                console.log(game);
                this.router.navigateByUrl(`join/${game.accessId}`);
            }
        );
        this.loading = true;
    }

}
