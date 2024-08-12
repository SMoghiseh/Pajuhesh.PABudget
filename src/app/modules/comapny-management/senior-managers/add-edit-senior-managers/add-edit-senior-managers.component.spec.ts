import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSeniorManagersComponent } from './add-edit-senior-managers.component';

describe('AddEditSeniorManagersComponent', () => {
  let component: AddEditSeniorManagersComponent;
  let fixture: ComponentFixture<AddEditSeniorManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSeniorManagersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSeniorManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
