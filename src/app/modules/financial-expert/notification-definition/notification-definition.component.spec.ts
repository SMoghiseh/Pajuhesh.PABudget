/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDefinitionComponent } from './notification-definition.component';

describe('NotificationDefinitionComponent', () => {
  let component: NotificationDefinitionComponent;
  let fixture: ComponentFixture<NotificationDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationDefinitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
