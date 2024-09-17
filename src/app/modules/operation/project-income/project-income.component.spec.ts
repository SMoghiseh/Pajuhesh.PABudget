import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIncomeComponent } from './project-income.component';

describe('ProjectIncomeComponent', () => {
  let component: ProjectIncomeComponent;
  let fixture: ComponentFixture<ProjectIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectIncomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
