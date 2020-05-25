import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OneOfFourComponent} from './one-of-four.component';

describe('OneOfFourComponent', () => {
    let component: OneOfFourComponent;
    let fixture: ComponentFixture<OneOfFourComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OneOfFourComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OneOfFourComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
