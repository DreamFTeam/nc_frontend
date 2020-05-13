import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private zone: NgZone) {
  }

  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }

  getServerSentEvent(url: string, type: string): Observable<any> {
    return Observable.create(observer => {
      const eventSource = this.getEventSource(url);

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
