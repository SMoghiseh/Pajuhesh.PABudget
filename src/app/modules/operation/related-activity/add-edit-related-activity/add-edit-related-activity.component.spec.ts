import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedActivityComponent } from './add-edit-related-activity.component';

describe('RelatedActivityComponent', () => {
  let component: RelatedActivityComponent;
  let fixture: ComponentFixture<RelatedActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
