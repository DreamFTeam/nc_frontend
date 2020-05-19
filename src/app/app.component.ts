import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'quizApp';

  constructor(private translateService: TranslateService) {}
  
  ngOnInit(): void {
    this.translateService.use(environment.defaultLocale);
  }
}
