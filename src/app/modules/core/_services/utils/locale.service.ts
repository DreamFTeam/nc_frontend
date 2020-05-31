import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class LocaleService {

    constructor(public translateService: TranslateService) {
    }

    initUserLang(langA) {
        if (localStorage.getItem('userLang')) {
            this.setLang(localStorage.getItem('userLang'));
        } else {
            let lang;
            langA.subscribe(
                ans => lang = this.setLang(ans.value),
                err => {
                    console.log(err);
                    lang = this.setLang(environment.defaultLocale);
                },
                () => {
                    localStorage.setItem('userLang', lang);
                }
            );
        }
    }

    setAnonymousLang() {
        if (localStorage.getItem('anonymousLang')) { //If language in local storage
            return this.setLang(localStorage.getItem('anonymousLang'));
        } else {  //check locale
            const lang = this.setLang(this.getUsersLocale().substring(0, 2).toLocaleLowerCase());
            localStorage.setItem('anonymousLang', lang);
            return lang;
        }
    }

    setLang(locale): string {
        let lang = environment.locales.includes(locale) ? locale : environment.defaultLocale;
        this.translateService.use(lang);
        return lang;
    }

    initLangs() {
        this.translateService.addLangs(environment.locales);
        this.translateService.setDefaultLang(environment.defaultLocale);
    }

    getValue(keys): string {
        if (this.checkLang) {
            return this.translateService.instant(keys);
        }
    }

    getAnonymousLanguage() {
        if (localStorage.getItem('anonymousLang')) {
            return localStorage.getItem('anonymousLang');
        } else {
            return this.setAnonymousLang();
        }
    }

    

    getUserLanguage(){
        if (localStorage.getItem('userLang')) {
            return localStorage.getItem('userLang');
        } else {
            const lang = this.translateService.currentLang
            localStorage.setItem('userLang',lang);
            return lang;
        }
    }

    private checkLang(): boolean {
        if (this.translateService.currentLang) {
            return true;
        } else {
            setTimeout(this.checkLang, 500);
        }
    }

    private getUsersLocale(): string {
        if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
            return environment.defaultLocale;
        }
        let lang = window.navigator.language ||  environment.defaultLocale;
        return lang;
    }

}
