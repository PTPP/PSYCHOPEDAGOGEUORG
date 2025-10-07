import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aplikuj } from './aplikuj';

describe('Aplikuj', () => {
  let component: Aplikuj;
  let fixture: ComponentFixture<Aplikuj>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aplikuj]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aplikuj);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
