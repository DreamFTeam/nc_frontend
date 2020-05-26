import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../../core/_services/profile/profile.service';
import {Achievement} from '../../core/_models/achievement';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-last-achievements-list',
    templateUrl: './last-achievements-list.component.html',
    styleUrls: ['./last-achievements-list.component.css']
})
export class LastAchievementsListComponent implements OnInit {

    mockImgUrl = '../../assets/img/achievement.png';
    achievements$: Observable<Achievement[]>;
    isEmpty: boolean;

    constructor(private profileService: ProfileService) {
        this.isEmpty = false;
    }

    ngOnInit(): void {
        this.achievements$ = this.profileService.getLastAchievements();
        this.achievements$.subscribe(v => {
            if (v.length == 0) {
                this.isEmpty = true;
            }
        }, error => {
            console.error(error);
        });
    }

}
