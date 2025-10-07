import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolitykaPrywatnosci } from './polityka-prywatnosci';

describe('PolitykaPrywatnosci', () => {
  let component: PolitykaPrywatnosci;
  let fixture: ComponentFixture<PolitykaPrywatnosci>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolitykaPrywatnosci]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolitykaPrywatnosci);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
