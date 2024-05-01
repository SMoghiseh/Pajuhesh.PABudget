import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTblsComponent } from './document-tbls.component';

describe('DocumentTblsComponent', () => {
  let component: DocumentTblsComponent;
  let fixture: ComponentFixture<DocumentTblsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentTblsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentTblsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
