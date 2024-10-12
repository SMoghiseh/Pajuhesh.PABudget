import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProjectPicComponent } from './add-edit-project-pic.component';

describe('AddEditProjectPicComponent', () => {
  let component: AddEditProjectPicComponent;
  let fixture: ComponentFixture<AddEditProjectPicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProjectPicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProjectPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
