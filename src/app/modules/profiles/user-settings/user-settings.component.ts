import { Component, OnInit } from '@angular/core';
import { Setting } from '../../core/_models/setting';
import { SettingsService } from '../../core/_services/profile/settings.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { environment } from 'src/environments/environment';
import { LocaleService } from '../../core/_services/utils/locale.service';



@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  readonly languages = [
    { name: "English", value: `${environment.locales[0]}` },
    { name: "Українська", value: `${environment.locales[1]}` }
  ]

  language: Setting;

  loading: boolean;
  buttonLoading: boolean;

  settings: Setting[];

  faSpinner = faSpinner;

  constructor(private settingsService: SettingsService,
     public toastService: ToastsService, private localeService: LocaleService) { 
    
  }

  ngOnInit(): void {
    this.loading = true;
    this.buttonLoading = false;
    this.init();
    
  }

  setSettings(ans) {
    let temp: Setting[] = ans;
    const index = temp.findIndex(el => el.id === "e8449301-6d6f-4376-8247-b7d1f8df6416");
    this.language = temp.splice(index, 1)[0];
    this.settings = temp;

    temp.sort(function(a, b){
      return b.title.length - a.title.length;
    });

    this.loading = false;
  }


  save() {
    this.buttonLoading = true;
    this.settingsService.saveSettings(this.settings, this.language).subscribe(
      () => {
        this.init();
        this.toastService.toastAddSuccess(this.localeService.getValue('toasterEditor.saved'));
      },
      err => this.errHandler(this.localeService.getValue('toasterEditor.wentWrong'),err),
      () => this.buttonLoading = false
    )
  }

  init() {
    this.settingsService.getSettings()
      .subscribe(ans => this.setSettings(ans),
        err => this.errHandler(this.localeService.getValue('toasterEditor.wentWrong'), err));
  }

  errHandler(text,err){
    console.log(err);
    this.toastService.toastAddDanger(text)
  }



}
