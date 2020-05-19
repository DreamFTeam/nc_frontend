import { Component, OnInit } from '@angular/core';
import { SettingsService } from './_services/settings.service';
import { AuthenticationService } from './_services/authentication.service';
import { LocaleService } from './_services/locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'quizApp';


  constructor(
    private localeService: LocaleService,
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    if(this.authenticationService.currentUserValue){
      this.localeService.setUserLang( this.settingsService.getLanguage() );
    }else{
      this.localeService.setAnonymousLang();
    }
  }
}
