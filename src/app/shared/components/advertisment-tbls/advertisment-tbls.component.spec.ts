import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertismentTblsComponent } from './advertisment-tbls.component';

describe('AdvertismentTblsComponent', () => {
  let component: AdvertismentTblsComponent;
  let fixture: ComponentFixture<AdvertismentTblsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertismentTblsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertismentTblsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
