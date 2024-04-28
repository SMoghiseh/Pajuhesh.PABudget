/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicsDefinitionComponent } from './basics-definition.component';

describe('BasicsDefinitionComponent', () => {
  let component: BasicsDefinitionComponent;
  let fixture: ComponentFixture<BasicsDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicsDefinitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicsDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
