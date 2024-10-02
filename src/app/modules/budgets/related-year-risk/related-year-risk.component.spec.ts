import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedYearRiskComponent } from './related-year-risk.component';

describe('RelatedYearRiskComponent', () => {
  let component: RelatedYearRiskComponent;
  let fixture: ComponentFixture<RelatedYearRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedYearRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedYearRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
