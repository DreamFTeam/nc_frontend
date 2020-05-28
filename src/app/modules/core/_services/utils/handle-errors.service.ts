import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HandleErrorsService {

    constructor() {
    }

    public handleError<T>(operation = 'operation not specified', result?: T) {
        return (error: any): Observable<T> => {

            console.error("Operation: " + operation);
            console.error(error); // log to console instead

            return of(result as T);
        };
    }
}
