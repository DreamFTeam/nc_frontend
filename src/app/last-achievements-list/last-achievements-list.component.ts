import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../_services/profile.service';
import { Achievement } from '../_models/achievement';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-last-achievements-list',
  templateUrl: './last-achievements-list.component.html',
  styleUrls: ['./last-achievements-list.component.css']
})
export class LastAchievementsListComponent implements OnInit {

  mockImgUrl='../../assets/img/achievement.png';
  achievements$: Observable<Achievement[]>;

  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    this.achievements$ = this.profileService.getLastAchievements();
    this.achievements$.subscribe(v => console.log(v));
  }

}
