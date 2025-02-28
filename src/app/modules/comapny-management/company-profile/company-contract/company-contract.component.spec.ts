import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyContractComponent } from './company-contract.component';

describe('CompanyContractComponent', () => {
  let component: CompanyContractComponent;
  let fixture: ComponentFixture<CompanyContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
