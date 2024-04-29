import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertismentDetailComponent } from './advertisment-detail.component';

describe('AdvertismentDetailComponent', () => {
  let component: AdvertismentDetailComponent;
  let fixture: ComponentFixture<AdvertismentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertismentDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertismentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
