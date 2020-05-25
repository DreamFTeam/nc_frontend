import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuizzesRatingsComponent } from './user-quizzes-ratings.component';

describe('UserQuizzesRatingsComponent', () => {
  let component: UserQuizzesRatingsComponent;
  let fixture: ComponentFixture<UserQuizzesRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQuizzesRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuizzesRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
