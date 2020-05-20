import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../_services/profile.service';
import { QuizLastPlayed } from '../_models/quiz-last-played';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-last-played-games',
  templateUrl: './last-played-games.component.html',
  styleUrls: ['./last-played-games.component.css']
})
export class LastPlayedGamesComponent implements OnInit {

  gamesList$: Observable<QuizLastPlayed[]>;
  constructor(private profileService: ProfileService) { }
  timezone: string;
  
  ngOnInit(): void {
    this.gamesList$ = this.profileService.getLastPlayedGames();
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

}
