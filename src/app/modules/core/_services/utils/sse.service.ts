import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SseService {
    private sseConnectorUrl = `${environment.apiUrl}sse/stream/`;

    constructor(private zone: NgZone) {
    }

    getEventSource(url: string): EventSource {
        return new EventSource(url);
    }

    getServerSentEvent(key: string, type: string): Observable<any> {
        return Observable.create(observer => {
            const eventSource = this.getEventSource(this.sseConnectorUrl + key);

            eventSource.addEventListener(type, event => {
                this.zone.run(() => {
                    observer.next(event);
                });
            });

            eventSource.onerror = error => {
                this.zone.run(() => {
                    observer.error(error);
                });
            };
        });
    }

}
