import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortQuizListComponent } from './short-quiz-list.component';

describe('ShortQuizListComponent', () => {
  let component: ShortQuizListComponent;
  let fixture: ComponentFixture<ShortQuizListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortQuizListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortQuizListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
