import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHolderCompanyComponent } from './share-holder-company.component';

describe('ShareHolderCompanyComponent', () => {
  let component: ShareHolderCompanyComponent;
  let fixture: ComponentFixture<ShareHolderCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareHolderCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareHolderCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
