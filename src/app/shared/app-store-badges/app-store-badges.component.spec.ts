import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStoreBadgesComponent } from './app-store-badges.component';

describe('AppStoreBadgesComponent', () => {
  let component: AppStoreBadgesComponent;
  let fixture: ComponentFixture<AppStoreBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStoreBadgesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppStoreBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
