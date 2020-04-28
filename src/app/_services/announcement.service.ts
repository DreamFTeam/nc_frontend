import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Announcement } from '../_models/announcement';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { User } from '../_models/user';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  url = `${environment.apiUrl}`+"announcement";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).token
    })
  };
  user: User;
  
  constructor(private http: HttpClient) { 
    let info = JSON.parse(localStorage.getItem('userData'));
    this.user = jwt_decode(info.token)
    this.user.token = info.token;
  }

  //GET list of announcements in range
  getAnnouncements(start: number, amount: number): Observable<Announcement[]>{
    const options = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('start', start.toString()).set('amount', amount.toString())

    }

    return this.http.get<Announcement[]>(this.url + '/getall', options).pipe(
      map(data => data.map(x=>{
        return new Announcement().deserialize(x);
      }))
    );
  }

  //GET amount of announcements for pagination
  getAmount(): Observable<number>{
    const options = {
      headers: this.httpOptions.headers
    }

    return this.http.get<number>(this.url + '/getamount', options);
  }

  //POST new announcement
  addAnnouncement(announcement: Announcement): Observable<Announcement>{
    console.log('in add');
    let postAnnouncement = announcement;
    postAnnouncement.creatorId = this.user.id;

    return this.http.post<Announcement>(this.url + '/create', JSON.stringify(postAnnouncement), this.httpOptions);
  }

  //POST edited announcement
  editAnnouncement(announcement: Announcement): Observable<Announcement>{
    console.log('in edit');
    let postAnnouncement = announcement;
    postAnnouncement.creatorId = this.user.id;

    return this.http.post<Announcement>(this.url + '/edit', JSON.stringify(postAnnouncement), this.httpOptions);
  }

  //POST delete announcement
  deleteAnnouncement(id: string): Observable<Announcement>{
    console.log('in delete');
    const options = {
      headers: this.httpOptions.headers
    };

    return this.http.delete<Announcement>(this.url + '/delete/'+id, options);
  }

  //validate announcement
  validateAnnouncement(announcement: Announcement): boolean{
    return announcement.textContent !=="" && announcement.title !== "";
  }
}
