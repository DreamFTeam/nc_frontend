import { TestBed } from '@angular/core/testing';

import { GameQuestionService } from './game-question.service';

describe('GameQuestionService', () => {
  let service: GameQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
