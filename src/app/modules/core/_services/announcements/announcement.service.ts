import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Announcement } from '../../_models/announcement';
import { User } from '../../_models/user';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  url = `${environment.apiUrl}`+"announcement";
  user: User;
  
  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService) {
    this.user = authenticationService.currentUserValue;
  }

  //GET list of announcements in range
  getAnnouncements(start: number, amount: number): Observable<Announcement[]>{
    const options = {
      params: new HttpParams().set('start', start.toString()).set('amount', amount.toString())

    }

    return this.http.get<Announcement[]>(this.url + '/getall', options).pipe(
      map(data => data.map(x=>{
        return new Announcement().deserialize(x, this.sanitizer);
      }))
    );
  }

  //GET amount of announcements for pagination
  getAmount(): Observable<number>{

    return this.http.get<number>(this.url + '/getamount');
  }

  //POST new announcement
  addAnnouncement(announcement: Announcement, img: File): Observable<Announcement>{
    console.log('in add');
    let postAnnouncement = announcement;
    postAnnouncement.creatorId = this.user.id;
    const formData = new FormData();

    formData.append("obj", JSON.stringify(postAnnouncement));
    if(img !== undefined){
      formData.append("img",img, img.name);
    }
    

    return this.http.post<Announcement>(this.url + '/create', formData)
      .pipe(map(data => {
        console.log(data);
        return new Announcement().deserialize(data, this.sanitizer);
      }));
  }


  editAnnouncement(announcement: Announcement, img: File): Observable<Announcement> {
    console.log('in edit');
    let postAnnouncement = announcement;
    postAnnouncement.creatorId = this.user.id;
    const formData = new FormData();

    formData.append("obj", JSON.stringify(postAnnouncement));

    if(img !== undefined && img !== null){
      formData.append("img",img, img.name);
      formData.append("newimage","true");
    }else if(img === null){
      formData.append("newimage","true");
    }

    return this.http.post<Announcement>(this.url + '/edit', formData)
      .pipe(map(data => {
        console.log(data);
        return new Announcement().deserialize(data, this.sanitizer);
      }));
  }



  // //POST edited announcement
  // editAnnouncement(announcement: Announcement): Observable<Announcement>{
  //   console.log('in edit');
  //   let postAnnouncement = announcement;
  //   postAnnouncement.creatorId = this.user.id;

  //   return this.http.post<Announcement>(this.url + '/edit', JSON.stringify(postAnnouncement), this.httpOptions);
  // }

  //POST delete announcement
  deleteAnnouncement(id: string): Observable<Announcement>{
    console.log('in delete');

    return this.http.delete<Announcement>(this.url + '/delete/'+id);
  }

  //validate announcement
  validateAnnouncement(announcement: Announcement): boolean{
    return announcement.textContent !=="" && announcement.title !== "";
  }

  getAdminName(){
    return this.user.username;
  }

}
