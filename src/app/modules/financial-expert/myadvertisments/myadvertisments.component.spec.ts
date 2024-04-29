/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyadvertismentsComponent } from './myadvertisments.component';

describe('MyadvertismentsComponent', () => {
  let component: MyadvertismentsComponent;
  let fixture: ComponentFixture<MyadvertismentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyadvertismentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyadvertismentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
