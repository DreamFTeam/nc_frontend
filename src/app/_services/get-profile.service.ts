import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetProfileService {
  constructor() {
  }

  public getCurrentProfile() {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user == null) {
      return null;
    }
    return {
      username: user.username,
      image: user.image,
      aboutMe: user.aboutMe,
      lastSeen: new Date(user.lastTimeOnline).toLocaleString(),
      online: user.online,
    };
  }



}
