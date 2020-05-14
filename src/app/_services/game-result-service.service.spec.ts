import { TestBed } from '@angular/core/testing';

import { GameResultServiceService } from './game-result-service.service';

describe('GameResultServiceService', () => {
  let service: GameResultServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameResultServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
