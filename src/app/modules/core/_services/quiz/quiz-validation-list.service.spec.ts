import { TestBed } from '@angular/core/testing';

import { QuizValidationListService } from './quiz-validation-list.service';

describe('QuizValidationListService', () => {
  let service: QuizValidationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizValidationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
