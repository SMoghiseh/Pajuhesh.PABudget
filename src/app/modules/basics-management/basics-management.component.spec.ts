/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicsManagementComponent } from './basics-management.component';

describe('BasicsManagementComponent', () => {
  let component: BasicsManagementComponent;
  let fixture: ComponentFixture<BasicsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicsManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
