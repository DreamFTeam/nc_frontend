import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private options: Intl.ResolvedDateTimeFormatOptions;  
  
  readonly datePattern = "dd.MM.yyyy";
  readonly datetimePattern = "HH:mm, dd.MM.yyyy";

  constructor() { 
    this.options = Intl.DateTimeFormat().resolvedOptions();
  }

  get currentTimezone(): string{
    if(this.options.timeZone !== undefined){
      return this.options.timeZone;
    }
    return 'UTC';
  }
}
