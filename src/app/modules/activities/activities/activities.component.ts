import { Component, OnInit, OnDestroy } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Activity } from '../../core/_models/activity';
import { ActivityService } from '../../core/_services/user/activity.service';
import { DateService } from '../../core/_services/utils/date.service';
import { Subscription } from 'rxjs';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

    readonly pageSize: number = 5;
    page: number = 1;
    collectionSize: number;

    activities: Activity[] = [];

    loading: boolean;

    faSpinner = faSpinner;

    subscriptions: Subscription = new Subscription();

    constructor(private activityService: ActivityService,
        public dateService: DateService,
        public toastsService: ToastsService,
        private localeService: LocaleService) {
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(){
        this.loading = true;
        this.subscriptions.add(this.activityService.getActivitySize()
        .subscribe(
            ans => {
                this.collectionSize = ans
                this.subscriptions.add(this.activityService.getActivityList(((this.page -1) * this.pageSize) +1, this.pageSize)
                    .subscribe(
                        ans => this.activities = ans,
                        () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong')), 
                        () => this.loading = false));
            },
        () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
        ));
    }

}
