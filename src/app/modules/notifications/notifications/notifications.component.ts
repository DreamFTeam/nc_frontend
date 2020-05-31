import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NotificationsService} from '../../core/_services/user/notifications.service';
import {environment} from '../../../../environments/environment';
import {Notification} from '../../core/_models/notification';
import { LocaleService } from '../../core/_services/utils/locale.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
    notifications: Notification[];
    newNotification: boolean;
    language: string;
    locales: string[];

    constructor(private notificationsService: NotificationsService,
        private localeService: LocaleService) {
    }

    ngOnInit(): void {

        this.locales = environment.locales;
        this.language = this.localeService.getLanguage();
        this.notificationsService.notifications
            .subscribe(notifications => {
                this.notifications = notifications;
                this.newNotification = this.notifications && this.notifications.length > 0;
            });
    }

    @HostListener('window:beforeunload', ['$event'])
    ngOnDestroy(): void {
        this.notificationsService.setSeen().subscribe();
    }

}
