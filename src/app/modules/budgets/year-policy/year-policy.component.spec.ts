import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearPolicyComponent } from './year-policy.component';

describe('YearPolicyComponent', () => {
  let component: YearPolicyComponent;
  let fixture: ComponentFixture<YearPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
