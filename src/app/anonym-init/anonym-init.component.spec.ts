import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymInitComponent } from './anonym-init.component';

describe('AnonimInitComponent', () => {
  let component: AnonymInitComponent;
  let fixture: ComponentFixture<AnonymInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonymInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
