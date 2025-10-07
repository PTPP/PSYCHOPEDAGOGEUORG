import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StronaGlowna } from './strona-glowna';

describe('StronaGlowna', () => {
  let component: StronaGlowna;
  let fixture: ComponentFixture<StronaGlowna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StronaGlowna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StronaGlowna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
