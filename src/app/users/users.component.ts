import { Component, OnInit } from '@angular/core';
import { GetProfileService } from '../_services/get-profile.service'
import { Profile } from '../_models/profile';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  searchResults: Profile[];
  username: string;

  constructor(private getProfileService: GetProfileService,
              private sanitizer: DomSanitizer
  ) {
    this.searchResults = null;
    this.username = '';
  }


  ngOnInit(): void {
    this.search();
  }

  search() {
    this.getProfileService.getProfilebyUserName(this.username).subscribe(
      data => {
        this.searchResults = data;
        this.searchResults.forEach(element => {
          return Profile.deserialize(element, this.sanitizer)
        });
      });
  }
}
