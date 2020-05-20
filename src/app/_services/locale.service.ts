import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ToastsService } from './toasts.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(public translateService: TranslateService,
    private toastsService: ToastsService) { }

  setUserLang(langA) {
    if(localStorage.getItem("userLang")){
      this.setLang(localStorage.getItem("userLang"));
    }else{
      let lang;
      langA.subscribe(
        ans => lang = this.setLang(ans.value.slice()),
        () => {
          lang = this.setLang(environment.defaultLocale);
        },
        () => {
          console.log("current lang is "+this.translateService.currentLang);
          localStorage.setItem('userLang',lang);
        }
      );
    }
    

  }

  setAnonymousLang() {
    if (localStorage.getItem('anonymousLang')) { //If language in local storage
      this.setLang(localStorage.getItem('anonymousLang'));
    } else {  //check locale
        const lang = this.setLang(this.getUsersLocale().substring(0, 2));
        localStorage.setItem('anonymousLang',lang);
    }
    console.log("set lang: "+this.translateService.currentLang);
  }

  setLang(locale): string{
    let lang = environment.locales.includes(locale) ? locale : environment.defaultLocale;
    this.translateService.use(lang);
    return lang;
  }

  initLangs(){
    this.translateService.addLangs(environment.locales)
    this.translateService.setDefaultLang(environment.defaultLocale);
  }

  getValue(keys): string{
    if (this.checkLang) {
      return this.translateService.instant(keys);
    }
  }

  private checkLang(): boolean{
    if (this.translateService.currentLang) {
      return true;
    }
    else {
      setTimeout(this.checkLang, 500);
    }
  }

  private getUsersLocale(): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return environment.defaultLocale;
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : environment.defaultLocale;
    lang =  wn.language || wn.browserLanguage || wn.userLanguage || lang;
    return lang;
  }
  
}
