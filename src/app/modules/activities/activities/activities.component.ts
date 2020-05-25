import {Component, OnInit} from '@angular/core';
import {Activity} from '../../core/_models/activity';
import {ActivityService} from '../../core/_services/user/activity.service';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

    activities: Activity[];

    loading: boolean;

    faSpinner = faSpinner;


    constructor(private activityService: ActivityService) {
        this.activities = [];
        this.loading = true;
    }

    ngOnInit(): void {
        this.activityService.getActivityList().subscribe(
            ans => this.activities = ans,
            err => console.log(err), () => this.loading = false);
    }

}
