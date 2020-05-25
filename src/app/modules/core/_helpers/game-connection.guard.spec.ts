import { TestBed } from '@angular/core/testing';

import { GameConnectionGuard } from './game-connection.guard';

describe('GameConnectionGuard', () => {
  let guard: GameConnectionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GameConnectionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
