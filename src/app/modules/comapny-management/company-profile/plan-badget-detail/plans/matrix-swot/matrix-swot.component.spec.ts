import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixSwotComponent } from './matrix-swot.component';

describe('MatrixSwotComponent', () => {
  let component: MatrixSwotComponent;
  let fixture: ComponentFixture<MatrixSwotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrixSwotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixSwotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
