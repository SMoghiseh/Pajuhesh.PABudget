import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMapComponent } from './strategy-map.component';

describe('StrategyMapComponent', () => {
  let component: StrategyMapComponent;
  let fixture: ComponentFixture<StrategyMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
