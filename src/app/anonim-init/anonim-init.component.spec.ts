import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonimInitComponent } from './anonim-init.component';

describe('AnonimInitComponent', () => {
  let component: AnonimInitComponent;
  let fixture: ComponentFixture<AnonimInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonimInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonimInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
