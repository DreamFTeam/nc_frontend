import { Component, OnInit } from '@angular/core';
import { Setting } from '../_models/setting';
import { SettingsService } from '../_services/settings.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastsService } from '../_services/toasts.service';



@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  readonly languages = [
    { name: "English", value: "eng" },
    { name: "Українська", value: "ukr" }
  ]

  language: Setting;

  loading: boolean;

  settings: Setting[];

  faSpinner = faSpinner;

  constructor(private settingsService: SettingsService,
     public toastService: ToastsService) { 
    
  }

  ngOnInit(): void {
    this.loading = true;
    this.settingsService.getSettings()
      .subscribe(ans => this.setSettings(ans), 
      err => err => this.errHandler("Couldn`t load your settings :(",err),);
  }

  setSettings(ans) {
    let temp: Setting[] = ans;
    const index = temp.findIndex(el => el.title === "Language");
    this.language = temp.splice(index, 1)[0];
    this.settings = temp;

    temp.sort(function(a, b){
      return b.title.length - a.title.length;
    });

    this.loading = false;
  }


  save() {
    const saved = this.settings.map(el => ({ ... (el) })).concat(Object.assign({}, this.language));


    saved.map(el => ["title", "description"].map(x => delete el[x]));
    saved.map(el => el.value = el.value.toString());

    console.log(this.settings);
    console.log(saved);

    this.loading = true;
    this.settingsService.saveSettings(saved).subscribe(
      () => this.toastService.toastAddSuccess("Saved"),
      err => this.errHandler("Couldn`t save your settings :(",err),
      () => this.loading = false
    )
  }

  errHandler(text,err){
    console.log(err);
    this.toastService.toastAddDanger(text)
  }



}
