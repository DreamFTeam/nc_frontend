import {Component, OnInit, OnDestroy} from '@angular/core';
import {Setting} from '../../core/_models/setting';
import {SettingsService} from '../../core/_services/profile/settings.service';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import {environment} from 'src/environments/environment';
import {LocaleService} from '../../core/_services/utils/locale.service';
import {SearchFilterQuizService} from '../../core/_services/quiz/search-filter-quiz.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit, OnDestroy {
    readonly languages = [
        {name: 'English', value: `${environment.locales[0]}`},
        {name: 'Українська', value: `${environment.locales[1]}`}
    ];

    language: Setting;

    loading: boolean = true;
    buttonLoading: boolean = false;

    settings: Setting[];

    faSpinner = faSpinner;

    subscriptions: Subscription = new Subscription();

    constructor(private settingsService: SettingsService,
                public toastService: ToastsService,
                private localeService: LocaleService,
                private searchFilterQuizService: SearchFilterQuizService) {

    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.getSettings();
    }

    getSettings(){
        this.subscriptions.add(this.settingsService.getSettings()
        .subscribe(ans => this.setSettings(ans),
            () => this.toastService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))));
    }

    setSettings(ans) {
        let temp: Setting[] = ans;
        const index = temp.findIndex(el => el.id === 'e8449301-6d6f-4376-8247-b7d1f8df6416');
        this.language = temp.splice(index, 1)[0];
        this.settings = temp;

        temp.sort(function(a, b) {
            return b.title.length - a.title.length;
        });

        this.loading = false;
    }


    save() {
        this.buttonLoading = true;
        this.subscriptions.add(this.settingsService.saveSettings(this.settings, this.language).subscribe(
            () => {
                this.getSettings();
                this.toastService.toastAddSuccess(this.localeService.getValue('toasterEditor.saved'));
                this.searchFilterQuizService.initSettings();
            },
            () => this.toastService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong')),
            () => this.buttonLoading = false
        ));
    }



}
