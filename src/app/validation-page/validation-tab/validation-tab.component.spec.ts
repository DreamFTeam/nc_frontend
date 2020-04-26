import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTabComponent } from './validation-tab.component';

describe('ValidationTabComponent', () => {
  let component: ValidationTabComponent;
  let fixture: ComponentFixture<ValidationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
