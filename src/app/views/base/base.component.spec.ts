import { TestBed } from '@angular/core/testing';
import { BaseComponent } from './base.component';

describe('BaseComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(BaseComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
