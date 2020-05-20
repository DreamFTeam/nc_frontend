import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../_services/profile.service';
import { Achievement } from '../_models/achievement';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/role';

@Component({
  selector: 'app-last-achievements-list',
  templateUrl: './last-achievements-list.component.html',
  styleUrls: ['./last-achievements-list.component.css']
})
export class LastAchievementsListComponent implements OnInit {

  achievements: Observable<Achievement[]>;

  constructor(private profileService:ProfileService,
    ) { }

  ngOnInit(): void {
    
  }

}
