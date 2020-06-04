import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProfileService} from '../../core/_services/profile/profile.service';
import {QuizLastPlayed} from '../../core/_models/quiz-last-played';
import {Observable, Subscription} from 'rxjs';
import { DateService } from '../../core/_services/utils/date.service';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-last-played-games',
    templateUrl: './last-played-games.component.html',
    styleUrls: ['./last-played-games.component.css']
})
export class LastPlayedGamesComponent implements OnInit, OnDestroy {

    subscriptions: Subscription = new Subscription();
    gamesList:QuizLastPlayed[];

    faSpinner = faSpinner;
    isLoading: boolean;
    isEmpty: boolean;

    constructor(private profileService: ProfileService,
        public dateService: DateService) {
        this.isEmpty = false;
        this.isLoading = true;
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.subscriptions.add(this.profileService.getLastPlayedGames().subscribe(v => {
            this.gamesList = v;
            if (v.length == 0) {
                this.isEmpty = true;
            }
            this.isLoading = false;
        }, error => {
            console.error(error);
        }));

    }

}
