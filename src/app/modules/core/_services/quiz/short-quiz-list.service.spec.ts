import {TestBed} from '@angular/core/testing';

import {ShortQuizListService} from './short-quiz-list.service';

describe('ShortQuizListService', () => {
    let service: ShortQuizListService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ShortQuizListService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
