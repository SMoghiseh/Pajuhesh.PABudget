import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorManagersComponent } from './senior-managers.component';

describe('SeniorManagersComponent', () => {
  let component: SeniorManagersComponent;
  let fixture: ComponentFixture<SeniorManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeniorManagersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeniorManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
