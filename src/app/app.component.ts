import { Component, OnInit } from '@angular/core';
import { SettingsService } from './modules/core/_services/profile/settings.service';
import { AuthenticationService } from './modules/core/_services/authentication/authentication.service';
import { LocaleService } from './modules/core/_services/utils/locale.service';
import { TranslateService } from '@ngx-translate/core';

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
    
    this.localeService.initLangs();
    if(this.authenticationService.currentUserValue){
      this.localeService.initUserLang( this.settingsService.getLanguage());
    }else{
      this.localeService.setAnonymousLang();
    }
  }
}
