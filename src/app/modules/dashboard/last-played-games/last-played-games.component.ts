import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../../core/_services/profile/profile.service';
import {QuizLastPlayed} from '../../core/_models/quiz-last-played';
import {Observable} from 'rxjs';
import { TimezoneService } from '../../core/_services/utils/timezone.service';

@Component({
    selector: 'app-last-played-games',
    templateUrl: './last-played-games.component.html',
    styleUrls: ['./last-played-games.component.css']
})
export class LastPlayedGamesComponent implements OnInit {

    gamesList$: Observable<QuizLastPlayed[]>;
    isEmpty: boolean;

    constructor(private profileService: ProfileService,
        public timezoneService: TimezoneService) {
        this.isEmpty = false;
    }

    ngOnInit(): void {

        this.gamesList$ = this.profileService.getLastPlayedGames();
        this.gamesList$.subscribe(v => {
            if (v.length == 0) {
                this.isEmpty = true;
            }
        }, error => {
            console.error(error);
        });

    }

}
