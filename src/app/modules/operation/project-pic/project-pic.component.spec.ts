import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPicComponent } from './project-pic.component';

describe('ProjectPicComponent', () => {
  let component: ProjectPicComponent;
  let fixture: ComponentFixture<ProjectPicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
