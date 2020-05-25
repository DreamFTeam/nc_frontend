import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../core/_models/announcement';
import { AnnouncementService } from '../../core/_services/announcements/announcement.service';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { Role } from '../../core/_models/role';
import { ToastsService } from '../../core/_services/utils/toasts.service';

const PAGE_SIZE: number = 5;

@Component({
  selector: 'app-announcement-view',
  templateUrl: './announcement-view.component.html',
  styleUrls: ['./announcement-view.component.css']
})
export class AnnouncementViewComponent implements OnInit {
  
  announcements: Announcement[];

  collectionSize: number;
  page: number;
  pageSize: number;

  loading: boolean = true;

  faSpinner = faSpinner;

  constructor(private authenticationService: AuthenticationService, 
    private announcementService: AnnouncementService,
    public toastsService: ToastsService) { 
    this.announcementService.getAmount().subscribe(ans => this.collectionSize = ans, err => console.log(err));
    this.announcementService.getAnnouncements(0,5).subscribe(ans => 
      this.setAnnouncements(ans)
      , err => {
      console.log(err)
        this.toastsService.toastAddDanger("Error occured while fetching site announcements.\n We are sorry for that");
    });
  }

  ngOnInit(): void {
    this.page = 1;
    this.pageSize = PAGE_SIZE;
    this.loading = true;
  }

  setAnnouncements(ans){
    this.announcements = ans;
    this.loading = false;
  }

  loadPage(e){
    this.loading = true;
    this.announcementService.getAnnouncements((this.page-1) * 5 ,5).subscribe(ans => 
      this.setAnnouncements(ans)
      , err => console.log(err));
  }

  isPrivileged(){
    const user = this.authenticationService.currentUserValue;
    return user && (user.role !== Role.User); 
  }

}
