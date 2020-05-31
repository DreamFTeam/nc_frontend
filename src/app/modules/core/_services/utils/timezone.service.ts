import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  options: Intl.ResolvedDateTimeFormatOptions;  
  
  constructor() { 
    this.options = Intl.DateTimeFormat().resolvedOptions();
  }

  getCurrentTimezone(): string{
    if(this.options.timeZone !== undefined){
      return this.options.timeZone;
    }
    return 'UTC';
  }
}
