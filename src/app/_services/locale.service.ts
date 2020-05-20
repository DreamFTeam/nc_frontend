import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ToastsService } from './toasts.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(private translateService: TranslateService,
    private toastsService: ToastsService) { }

  setUserLang(lang) {
    lang.subscribe(
      ans => this.setLang(ans.value.slice()),
      () => {
        this.toastsService.toastAddDanger("Sorry, lang could not be retrieved :(")
        this.setAnonymousLang()
      }
    );

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

  getValue(keys): Observable<any>{
    return this.translateService.get(keys);
  }

  private getUsersLocale(): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return environment.defaultLocale;
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : environment.defaultLocale;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }
  
}
