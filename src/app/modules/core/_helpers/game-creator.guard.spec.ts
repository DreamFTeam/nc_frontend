import { TestBed } from '@angular/core/testing';

import { GameCreatorGuard } from './game-creator.guard';

describe('GameCreatorGuard', () => {
  let guard: GameCreatorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GameCreatorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
