import { Component, OnInit } from '@angular/core';
import { GetProfileService } from '../_services/get-profile.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  searchResults;

  constructor(private getProfileService: GetProfileService) {
    this.searchResults = null;
   }

  username: string;

  ngOnInit(): void {
    this.getProfileService.getProfilebyUserName('').subscribe(
      data => this.searchResults = data);
  }

  Search() {
    this.getProfileService.getProfilebyUserName(this.username).subscribe(
      result => {
        this.searchResults = result;
      });
  }



}
