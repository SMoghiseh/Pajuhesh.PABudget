

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDefinitionComponent } from './role-definition.component';

describe('RoleDefinitionComponent', () => {
  let component: RoleDefinitionComponent;
  let fixture: ComponentFixture<RoleDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleDefinitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
