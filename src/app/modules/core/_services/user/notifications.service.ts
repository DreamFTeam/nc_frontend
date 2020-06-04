import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Notification} from '../../_models/notification';
import {AuthenticationService} from '../authentication/authentication.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {ToastsService} from '../utils/toasts.service';
import {SseService} from '../utils/sse.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private notificationsSubject: BehaviorSubject<Notification[]>;
    public notifications: Observable<Notification[]>;

    private notificationsUrl = `${environment.apiUrl}notifications/`;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private authenticationService: AuthenticationService,
                private http: HttpClient,
                private sseService: SseService,
                private toastsService: ToastsService) {
        this.notificationsSubject = new BehaviorSubject<Notification[]>([]);
        this.notifications = this.notificationsSubject.asObservable();
        if (authenticationService.currentUserValue) {
            this.sseService.getServerSentEvent(this.notificationsUrl + 'subscribe/' +
                this.authenticationService.currentUserValue.id, 'sent')
                .subscribe(() => {
                    this.getUnseen().subscribe();
                });
        }
    }

    getUnseen(): Observable<Notification[]> {
        return this.http.get<Notification[]>(this.notificationsUrl, this.httpOptions).pipe(
            map(nots => {
                nots.map(this.generateLinkNotification);
                this.notificationsSubject.next(nots);
                return nots;
            })
        );
    }

    setSeen() {
        this.notificationsSubject.next([]);
        return this.http.patch(this.notificationsUrl + 'seen', this.httpOptions);
    }

    sendNot() {
        return this.http.get(this.notificationsUrl + 'new', this.httpOptions);
    }

    getById(notificationId: string): Observable<Notification> {
        return this.http.get<Notification>(this.notificationsUrl +
            `notification/${notificationId}`, this.httpOptions);
    }

    showNotification(notificationId: string) {
        this.getById(notificationId).subscribe(n => {
            this.toastsService.toastAdd(n.content, {header: ''});
        });
    }

    private generateLinkNotification(notification: Notification): Notification {
        switch (notification.typeId) {
            case 1:
                notification.link = '/requests';
                return notification;
            case 2:
                notification.link = `/viewquiz/${notification.link}`;
                return notification;
            case 3:
                notification.link = `/profiles/${notification.link}/3`;
                return notification;
            default:
                return notification;
        }
    }

    getAmounts(): Observable<number> {
        return this.http.get<number>(this.notificationsUrl + 'amount', this.httpOptions).pipe(
            map(jsonObject => {
                const obj: any = jsonObject;
                return obj.amount;
            })
        );
    }
}
