import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizValidationComponent } from './quiz-validation.component';

describe('QuizValidationComponent', () => {
  let component: QuizValidationComponent;
  let fixture: ComponentFixture<QuizValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
