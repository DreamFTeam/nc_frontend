import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Notification} from '../_models/notification';
import {NotificationsService} from '../_services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[];
  newNotification: boolean;

  constructor(private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.notificationsService.notifications
      .subscribe(notfs => {
        this.notifications = notfs;
        this.newNotification = this.notifications && this.notifications.length > 0;
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy(): void {
    this.notificationsService.setSeen().subscribe();
  }

}
