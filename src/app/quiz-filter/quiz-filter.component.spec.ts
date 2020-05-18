import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFilterComponent } from './quiz-filter.component';

describe('QuizFilterComponent', () => {
  let component: QuizFilterComponent;
  let fixture: ComponentFixture<QuizFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
