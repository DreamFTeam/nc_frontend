import { Component, OnInit, OnDestroy } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Activity } from '../../core/_models/activity';
import { ActivityService } from '../../core/_services/user/activity.service';
import { DateService } from '../../core/_services/utils/date.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

    activities: Activity[];

    loading: boolean;

    faSpinner = faSpinner;

    subscriptions: Subscription = new Subscription();

    constructor(private activityService: ActivityService,
        public dateService: DateService) {
        this.activities = [];
        this.loading = true;
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.subscriptions.add(this.activityService.getActivityList().subscribe(
            ans => this.activities = ans,
        () => {}, () => this.loading = false));
    }

}
