import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrivilegedComponent } from './create-privileged.component';

describe('CreatePrivilegedComponent', () => {
  let component: CreatePrivilegedComponent;
  let fixture: ComponentFixture<CreatePrivilegedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePrivilegedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrivilegedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
