import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalPlansComponent } from './operational-plans.component';

describe('OperationalPlansComponent', () => {
  let component: OperationalPlansComponent;
  let fixture: ComponentFixture<OperationalPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationalPlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationalPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
