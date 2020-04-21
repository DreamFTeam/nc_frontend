import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service'
import { GetProfileService } from '../_services/get-profile.service';
@Component({
  selector: 'app-current-profile',
  templateUrl: './current-profile.component.html',
  styleUrls: ['./current-profile.component.css']
})
export class CurrentProfileComponent implements OnInit {
  profile;
  constructor(private _router: Router,private authenticationService: AuthenticationService, private getProfileService: GetProfileService ){}

  ngOnInit(): void {
    this.profile = this.getProfileService.getCurrentProfile()
      if (this.profile == null){
        this._router.navigate(['/'])
      }
    }


    search(){
      alert("Searching...")
    }

}
