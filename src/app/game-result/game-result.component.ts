import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {single} from 'src/app/game-result/data';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GameResultComponent implements OnInit {

  single: any[];
  maxPoints: number;
  champion;
  view = [600, 400];

  colorScheme = {
    domain: ['#e5de09', '#9e0505', '#05b4ff', '#FF5005']
  };

  constructor() {
    this.single = single;
    this.maxPoints = 800;
    Object.assign(this, {single});
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit(): void {
    // find champion
    // tslint:disable-next-line:only-arrow-functions
    this.champion = single.reduce(function(prev, current) {
      return (prev.value > current.value) ? prev : current;
    });
  }

}
