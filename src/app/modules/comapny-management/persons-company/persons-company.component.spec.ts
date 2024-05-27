import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsCompanyComponent } from './persons-company.component';

describe('PersonsCompanyComponent', () => {
  let component: PersonsCompanyComponent;
  let fixture: ComponentFixture<PersonsCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonsCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonsCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
