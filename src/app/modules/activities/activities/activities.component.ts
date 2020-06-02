import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Activity } from '../../core/_models/activity';
import { ActivityService } from '../../core/_services/user/activity.service';
import { DateService } from '../../core/_services/utils/date.service';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

    activities: Activity[];

    loading: boolean;

    faSpinner = faSpinner;


    constructor(private activityService: ActivityService,
        public dateService: DateService) {
        this.activities = [];
        this.loading = true;
    }

    ngOnInit(): void {
        this.activityService.getActivityList().subscribe(
            ans => this.activities = ans,
            err => console.log(err), () => this.loading = false);
    }

}
