import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertyPracy } from './oferty-pracy';

describe('OfertyPracy', () => {
  let component: OfertyPracy;
  let fixture: ComponentFixture<OfertyPracy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertyPracy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertyPracy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
