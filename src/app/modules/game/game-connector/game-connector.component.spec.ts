import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConnectorComponent } from './game-connector.component';

describe('GameConnectorComponent', () => {
  let component: GameConnectorComponent;
  let fixture: ComponentFixture<GameConnectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameConnectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
