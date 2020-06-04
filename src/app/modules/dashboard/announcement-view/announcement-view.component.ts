import {Component, OnInit, OnDestroy} from '@angular/core';
import {Announcement} from '../../core/_models/announcement';
import {AnnouncementService} from '../../core/_services/announcements/announcement.service';

import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {Role} from '../../core/_models/role';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import { Subscription } from 'rxjs';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { DateService } from '../../core/_services/utils/date.service';


@Component({
    selector: 'app-announcement-view',
    templateUrl: './announcement-view.component.html',
    styleUrls: ['./announcement-view.component.css']
})
export class AnnouncementViewComponent implements OnInit, OnDestroy {
    
    readonly pageSize: number = 5;

    announcements: Announcement[];

    collectionSize: number;
    page: number = 1;
    
    loading: boolean;
    faSpinner = faSpinner;

    subscriptions: Subscription = new Subscription();

    constructor(private authenticationService: AuthenticationService,
        private announcementService: AnnouncementService,
        public toastsService: ToastsService,
        private localeService: LocaleService,
        public dateService: DateService) {
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.loadPage();
    }

    setAnnouncements(ans) {
        this.announcements = ans;
        this.loading = false;
    }

    loadPage() {
        this.loading = true;

        this.subscriptions.add(this.announcementService.getAmount().subscribe(
            ans => this.collectionSize = ans, 
            () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))));

            this.subscriptions.add(this.announcementService.getAnnouncements((this.page - 1) * 5, 5).subscribe(
            ans =>
                this.setAnnouncements(ans)
            , 
            () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))));
    }

    isPrivileged() {
        const user = this.authenticationService.currentUserValue;
        return user && (user.role !== Role.User);
    }
    

}
