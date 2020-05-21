import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../_services/question.service';
import {GameQuestionService} from '../_services/game-question.service';
import {OneToFour} from '../_models/question/onetofour';
import {TrueFalse} from '../_models/question/truefalse';
import {OpenAnswer} from '../_models/question/openanswer';
import {SequenceAnswer} from '../_models/question/sequenceanswer';
import {switchMap} from 'rxjs/operators';
import {Game} from '../_models/game';
import {SseService} from '../_services/sse.service';
import {GameSettingsService} from '../_services/game-settings.service';
import {Subscription} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-game-question',
    templateUrl: './game-question.component.html',
    styleUrls: ['./game-question.component.css']
})
export class GameQuestionComponent implements OnInit, OnDestroy {
    game: Game = {
        id: '',
        startDatetime: new Date(),
        maxUsersCount: 0,
        numberOfQuestions: 0,
        roundDuration: 60,
        additionalPoints: false,
        breakTime: 30,
        accessId: '',
        quizId: ''
    };
    questionsLoading: boolean;
    faSpinner = faSpinner;

    timeLeft: number = 100; 
    interval;
    subscribeTimer: any;

    questions: (OneToFour | TrueFalse | OpenAnswer | SequenceAnswer)[] = [];
    currQuestNumb: number = 0;
    curq;
    curq_image;
    shuffled: string[];  
    answf: string;

    playerRating: number = 0;
    timeSpend: number = 0;

    waitResult: boolean;
    finishGame: Subscription;
    

    constructor(private gameQuestionService: GameQuestionService,
                private questionService: QuestionService,
                private activateRoute: ActivatedRoute,
                private router: Router,
                private sseService: SseService,
                private gameSettingsService: GameSettingsService) {
        this.questionsLoading = true;
        this.activateRoute.paramMap.pipe(
            switchMap(params => params.getAll('gameid')))
            .subscribe(data => this.loadGameData(data));
    }

    ngOnInit(): void {
    }

    sendResults() {
        this.gameQuestionService.savePlayerScore(localStorage.getItem('sessionid'), this.playerRating, this.timeSpend).subscribe();
    }

    loadGameData(data) {
        this.gameQuestionService.getGameData(data).subscribe(ans => this.mapGettedGameData(ans));
    }

    loadQuestionData() {
        this.questionService.getAllQuestions(this.game.quizId).subscribe(ans => this.mapGettedQuestions(ans), err => this.getQuestionsErr(err));
    }

    timer() {
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.nextQuestion();
                this.timeLeft = 100;
            }
        }, this.game.roundDuration / 100 * 1000);
    }

    mapGettedGameData(ans) {
        this.game.id = ans.id;
        this.game.startDatetime = ans.startDatetime;
        this.game.maxUsersCount = ans.maxUsersCount;
        this.game.numberOfQuestions = ans.numberOfQuestions;
        this.game.roundDuration = ans.roundDuration;
        this.game.additionalPoints = ans.additionalPoints;
        this.game.breakTime = ans.breakTime;
        this.game.accessId = ans.accessId;
        this.game.quizId = ans.quizId;
        this.loadQuestionData();
        console.log('Mapped game data: quizId - ' + this.game.quizId + ' startTime - ' + this.game.startDatetime);
    }

    mapGettedQuestions(ans) {
        for (let question of ans) {
            if (question.typeId === 1) {
                let rightAnswers: boolean[] = [];
                for (let i = 0; i < question.otherOptions.length; i++) {
                    rightAnswers.push(false);
                }
                for (let i = 0; i < question.rightOptions.length; i++) {
                    rightAnswers.push(true);
                }

                this.questions.push(new OneToFour(question.id, question.title, question.content,
                    question.imageContent, question.points, question.quizId, question.typeId,
                    question.otherOptions.concat(question.rightOptions), rightAnswers));
            }
            if (question.typeId === 2) {
                let otherOption: string;
                if (question.rightOptions[0]) {
                    otherOption = 'false';
                } else {
                    otherOption = 'true';
                }

                this.questions.push(new TrueFalse(question.id, question.title, question.content,
                    question.imageContent, question.points, question.quizId, question.typeId,
                    otherOption, question.rightOptions[0]));
            }
            if (question.typeId === 3) {
                this.questions.push(new OpenAnswer(question.id, question.title, question.content,
                    question.imageContent, question.points, question.quizId, question.typeId,
                    question.rightOptions[0]));
            }
            if (question.typeId === 4) {
                this.questions.push(new SequenceAnswer(question.id, question.title, question.content,
                    question.imageContent, question.points, question.quizId, question.typeId,
                    question.rightOptions));
            }
        }
        this.curq = this.questions[this.currQuestNumb];
        this.curq_image = this.questions[this.currQuestNumb].image;
        if (this.curq.typeId == 4) {
            let sqq: SequenceAnswer = this.curq;
            this.shuffled = sqq.rightAnswers.map((a) => ({
                sort: Math.random(),
                value: a
            })).sort((a, b) => a.sort - b.sort).map((a) => a.value);
        }
        this.questionsLoading = false;
        this.timer();
    }

    nextQuestion() {
        if (this.currQuestNumb < this.questions.length - 1 && this.currQuestNumb < this.game.numberOfQuestions - 1) {
            this.currQuestNumb++;
            this.curq = this.questions[this.currQuestNumb];
            this.curq_image = this.questions[this.currQuestNumb].image;
            if (this.curq.typeId == 4) {
                let sqq: SequenceAnswer = this.curq;
                this.shuffled = sqq.rightAnswers.map((a) => ({
                    sort: Math.random(),
                    value: a
                })).sort((a, b) => a.sort - b.sort).map((a) => a.value);
            }
        } else {
            this.sendResults();
            clearInterval(this.interval);
            this.waitResult = true;
            this.finishGame = this.sseService.getServerSentEvent(this.game.id, 'finished').subscribe(n => {
                    console.log('finished');
                    this.router.navigateByUrl(`game/result/${this.game.id}`);
                }
            );
        }
    }

    oneToFourAns(answ: String) {
        let otf: OneToFour = this.curq;
        this.timeSpend = this.timeSpend + Math.round((100 - this.timeLeft) * this.game.roundDuration / 100);
        for (let i = 0; i < otf.answers.length; i++) {
            if (answ == otf.answers[i] && otf.rightAnswers[i] == true) {
                if (this.game.additionalPoints == true && this.timeSpend < this.timeLeft) {
                    this.playerRating = this.playerRating + otf.points * 2;
                } else {
                    this.playerRating = this.playerRating + otf.points;
                }
            }
        }
        this.nextQuestion();
        this.timeLeft = 100;
    }

    trueFalseAns(answ: String) {
        let tf: TrueFalse = this.curq;
        this.timeSpend = this.timeSpend + Math.round((100 - this.timeLeft) * this.game.roundDuration / 100);
        if (answ == tf.rightAnswer) {
            if (this.game.additionalPoints == true && this.timeSpend < this.timeLeft) {
                this.playerRating = this.playerRating + tf.points * 2;
            } else {
                this.playerRating = this.playerRating + tf.points;
            }
        }
        this.nextQuestion();
        this.timeLeft = 100;
    }

    manualAns() {
        let oa: OpenAnswer = this.curq;
        this.timeSpend = this.timeSpend + Math.round((100 - this.timeLeft) * this.game.roundDuration / 100);
        if (oa.rightAnswer == this.answf) {
            if (this.game.additionalPoints == true && this.timeSpend < this.timeLeft) {
                this.playerRating = this.playerRating + oa.points * 2;
            } else {
                this.playerRating = this.playerRating + oa.points;
            }
        }
        this.answf = "";
        this.nextQuestion();
        this.timeLeft = 100;
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.shuffled, event.previousIndex, event.currentIndex);
    }

    seqAns() {
        let sq: SequenceAnswer = this.curq;
        let check: boolean = true;
        this.timeSpend = this.timeSpend + Math.round((100 - this.timeLeft) * this.game.roundDuration / 100);
        for (let i = 0; i < sq.rightAnswers.length; i++) {
            if (this.shuffled[i] != sq.rightAnswers[i]) {
                check = false;
            }
        }
        if (check == true) {
            if (this.game.additionalPoints == true && this.timeSpend < this.timeLeft) {
                this.playerRating = this.playerRating + sq.points * 2;
            } else {
                this.playerRating = this.playerRating + sq.points;
            }
        }
        this.nextQuestion();
        this.timeLeft = 100;
    }

    getQuestionsErr(err) {
        console.log(err);
        alert('Questions could not be retrieved: ' + err.error.message);
    }

    @HostListener('window:beforeunload', ['$event'])
    ngOnDestroy(): void {
        console.log('destroy');
        if (this.finishGame) {
            this.finishGame.unsubscribe();
        }
        if (!this.waitResult) {
            this.gameSettingsService.quitGame(localStorage.getItem('sessionid')).subscribe();
        }
        localStorage.removeItem('sessionid');
    }
}
