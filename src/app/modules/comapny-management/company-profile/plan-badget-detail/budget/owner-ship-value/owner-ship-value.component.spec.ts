import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShipValueComponent } from './owner-ship-value.component';

describe('OwnerShipValueComponent', () => {
  let component: OwnerShipValueComponent;
  let fixture: ComponentFixture<OwnerShipValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerShipValueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShipValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
