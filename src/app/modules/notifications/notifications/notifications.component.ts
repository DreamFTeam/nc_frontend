import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NotificationsService} from '../../core/_services/user/notifications.service';
import {environment} from '../../../../environments/environment';
import {first} from 'rxjs/operators';
import {DateService} from '../../core/_services/utils/date.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
    locales: string[];

    constructor(public notificationsService: NotificationsService,
                public dateService: DateService
    ) {
    }

    ngOnInit(): void {

        this.locales = environment.locales;
    }

    @HostListener('window:beforeunload', ['$event'])
    ngOnDestroy(): void {
        this.notificationsService.setSeen().pipe(first()).subscribe();
    }

}
