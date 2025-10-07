import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tpp } from './tpp';

describe('Tpp', () => {
  let component: Tpp;
  let fixture: ComponentFixture<Tpp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tpp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tpp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
