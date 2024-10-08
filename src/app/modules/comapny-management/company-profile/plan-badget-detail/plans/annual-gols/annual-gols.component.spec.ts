import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualGolsComponent } from './annual-gols.component';

describe('AnnualGolsComponent', () => {
  let component: AnnualGolsComponent;
  let fixture: ComponentFixture<AnnualGolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualGolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualGolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
