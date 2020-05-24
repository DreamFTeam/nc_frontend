import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegedProfileComponent } from './privileged-profile.component';

describe('PrivilegedProfileComponent', () => {
  let component: PrivilegedProfileComponent;
  let fixture: ComponentFixture<PrivilegedProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivilegedProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegedProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
