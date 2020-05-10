import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-anonim-init',
  templateUrl: './anonim-init.component.html',
  styleUrls: ['./anonim-init.component.css']
})
export class AnonimInitComponent implements OnInit {

  anonimName: string;

  constructor() { }

  ngOnInit(): void {
  }


  joinGame() {
    console.log(this.anonimName);
  }
}
