/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDefinitionComponent } from './company-definition.component';

describe('CompanyDefinitionComponent', () => {
  let component: CompanyDefinitionComponent;
  let fixture: ComponentFixture<CompanyDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyDefinitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
