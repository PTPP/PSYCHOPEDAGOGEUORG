import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tdp } from './tdp';

describe('Tdp', () => {
  let component: Tdp;
  let fixture: ComponentFixture<Tdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tdp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
