import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetProfileService } from '../_services/get-profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public profile;
  private username;
  ready : boolean
  owner;

  constructor(private _router: Router,
    private route: ActivatedRoute,
    private getProfileService: GetProfileService) {

  }

  ngOnInit(): void {
    if (GetProfileService.getCurrentProfile() == null) {
      this._router.navigate(['/']);
    }

    this.setUsername();
    this.owner = GetProfileService.getCurrentProfile() === this.username;

    this.getProfileService.getProfile(this.username).subscribe(
      result => {
        this.profile = result;
        this.ready = true;
      },
      error => {
        console.error(error.error);
        this._router.navigate(['/']);
      })
  }

  setUsername() {
    this.username = this.route.snapshot.paramMap.get('username');
    if (this.username == null) {
      this.username = GetProfileService.getCurrentProfile()
      this._router.navigate(['/profile/' + GetProfileService.getCurrentProfile()]);
    }

  }

  edit() {
    this._router.navigate(['/editprofile'], { state:  { data: this.profile.username}});

  }


}
