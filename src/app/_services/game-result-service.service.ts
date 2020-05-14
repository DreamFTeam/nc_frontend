import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameResultServiceService {

  url = `${environment.apiUrl}/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor() { }
}
