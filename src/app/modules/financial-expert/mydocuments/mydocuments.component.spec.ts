/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MydocumentsComponent } from './mydocuments.component';

describe('MydocumentsComponent', () => {
  let component: MydocumentsComponent;
  let fixture: ComponentFixture<MydocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MydocumentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MydocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
