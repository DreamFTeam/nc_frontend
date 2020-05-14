import { Component, OnInit } from '@angular/core';
import { Activity } from '../_models/activity';
import { ActivityService } from '../_services/activity.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  activities: Activity[];


  constructor(private activityService: ActivityService) {
    this.activities=[];
   }

  ngOnInit(): void {
    this.activityService.getActivityList().subscribe(
      ans => this.activities = ans, 
      err => console.log(err));
  }

}
