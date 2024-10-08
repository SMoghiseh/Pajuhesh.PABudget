import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDefinitionLookupComponent } from './company-definition-lookup.component';

describe('CompanyDefinitionLookupComponent', () => {
  let component: CompanyDefinitionLookupComponent;
  let fixture: ComponentFixture<CompanyDefinitionLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDefinitionLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDefinitionLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
