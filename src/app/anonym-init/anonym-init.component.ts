import {Component, OnInit} from '@angular/core';
import {AnonymService} from '../_services/anonym.service';
import {GameSettingsService} from '../_services/game-settings.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-anonim-init',
  templateUrl: './anonym-init.component.html',
  styleUrls: ['./anonym-init.component.css']
})
export class AnonymInitComponent implements OnInit {

  anonymName: string;
  loading: boolean;

  constructor(private anonymService: AnonymService,
              private gameSettingsService: GameSettingsService,
              private router: Router,
              private activeRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
  }


  joinGame() {

    if (this.anonymName) {
      this.loading = true;
      console.log(this.anonymName);
      this.anonymService.anonymLogin(this.anonymName).subscribe(anon => {
        console.log(anon);
        this.gameSettingsService.join(this.activeRouter.snapshot.paramMap.get('accessId'))
          .subscribe(session => {
              console.log(session);
              localStorage.setItem('sessionid', session.id);
              this.router.navigateByUrl(`game/${session.gameId}/lobby`);
            },
            error => {
              // this.modal.show('An error occurred', 'An error occurred.');
              // this.router.navigateByUrl('/');
              console.error(error);
              return false;
            }
          );
      });
    }
  }
}
