import {TestBed} from '@angular/core/testing';

import {SearchFilterQuizService} from './search-filter-quiz.service';

describe('SearchFilterQuizService', () => {
    let service: SearchFilterQuizService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SearchFilterQuizService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
