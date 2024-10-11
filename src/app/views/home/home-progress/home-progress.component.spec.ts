import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProgressComponent } from './home-progress.component';

describe('HomeProgressComponent', () => {
  let component: HomeProgressComponent;
  let fixture: ComponentFixture<HomeProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
