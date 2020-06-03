import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class LocaleService {

    constructor(public translateService: TranslateService) {
    }

    //Initialize all langs of application
    initLangs() {
        this.translateService.addLangs(environment.locales);
        this.translateService.setDefaultLang(environment.defaultLocale);
    }

    initUserLang(langA) {
        langA.subscribe(
            ans => this.setLang(ans.value),
            () => {
                this.setLang(environment.defaultLocale);
            }
        );

    }

    initAnonymousLang() {
        if (localStorage.getItem('anonymousLang')) { //If language in local storage
            return this.setLang(localStorage.getItem('anonymousLang'));
        } else {  //check locale
            const lang = this.setLang(this.translateService.getBrowserLang().substring(0, 2).toLocaleLowerCase());
            localStorage.setItem('anonymousLang', lang);
            return lang;
        }
    }

    setLang(locale): string {
        let lang = environment.locales.includes(locale) ? locale : environment.defaultLocale;
        this.translateService.use(lang);
        return lang;
    }

    getValue(keys): string {
        if (this.checkLang) {
            return this.translateService.instant(keys);
        }
    }

    getLanguage() {
        return this.translateService.currentLang || environment.defaultLocale;
    }

    private checkLang(): boolean {
        if (this.translateService && this.translateService.currentLang) {
            return true;
        } else {
            setTimeout(this.checkLang, 500);
        }
    }
}
