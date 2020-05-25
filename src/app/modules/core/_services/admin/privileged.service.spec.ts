import {TestBed} from '@angular/core/testing';

import {PrivilegedService} from './privileged.service';

describe('PrivilegedService', () => {
    let service: PrivilegedService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PrivilegedService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
