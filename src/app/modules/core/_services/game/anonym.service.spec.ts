import { TestBed } from '@angular/core/testing';

import { AnonymService } from './anonym.service';

describe('AnonymService', () => {
  let service: AnonymService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnonymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
