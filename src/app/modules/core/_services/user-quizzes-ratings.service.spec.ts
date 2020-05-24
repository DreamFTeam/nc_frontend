import { TestBed } from '@angular/core/testing';

import { UserQuizzesRatingsService } from './user-quizzes-ratings.service';

describe('UserQuizzesRatingsService', () => {
  let service: UserQuizzesRatingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserQuizzesRatingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
