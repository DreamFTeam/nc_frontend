import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeqOptionsComponent } from './seq-options.component';

describe('SeqOptionsComponent', () => {
  let component: SeqOptionsComponent;
  let fixture: ComponentFixture<SeqOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeqOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeqOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
