import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonelNoComponent } from './personel-no.component';

describe('PersonelNoComponent', () => {
  let component: PersonelNoComponent;
  let fixture: ComponentFixture<PersonelNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonelNoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonelNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
