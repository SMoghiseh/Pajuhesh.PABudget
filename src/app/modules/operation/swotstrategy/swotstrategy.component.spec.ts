import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SWOTStrategyComponent } from './swotstrategy.component';

describe('SWOTStrategyComponent', () => {
  let component: SWOTStrategyComponent;
  let fixture: ComponentFixture<SWOTStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SWOTStrategyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SWOTStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
