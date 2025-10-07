import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrzyciskPowrotu } from './przycisk-powrotu';

describe('PrzyciskPowrotu', () => {
  let component: PrzyciskPowrotu;
  let fixture: ComponentFixture<PrzyciskPowrotu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrzyciskPowrotu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrzyciskPowrotu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
