import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonelNoDetailComponent } from './personel-no-detail.component';

describe('PersonelNoDetailComponent', () => {
  let component: PersonelNoDetailComponent;
  let fixture: ComponentFixture<PersonelNoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonelNoDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonelNoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
