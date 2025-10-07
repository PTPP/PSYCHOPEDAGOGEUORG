import { Routes } from '@angular/router';
import { Aplikuj } from './aplikuj/aplikuj';
import { PolitykaPrywatnosci } from './polityka-prywatnosci/polityka-prywatnosci';
import { OfertyPracy } from './oferty-pracy/oferty-pracy';
import { Tpp } from './tpp/tpp';
import { Tdp } from './tdp/tdp';
import { StronaGlowna } from './strona-glowna/strona-glowna';

export const routes: Routes = [
  { path: '', component: StronaGlowna },
  { path: 'aplikuj', component: Aplikuj },
  { path: 'polityka-prywatnosci', component: PolitykaPrywatnosci },
  { path: 'oferty-pracy', component: OfertyPracy },
  { path: 'tpp', component: Tpp },
  { path: 'tdp', component: Tdp },
];
