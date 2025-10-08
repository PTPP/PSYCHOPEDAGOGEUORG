import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./strona-glowna/strona-glowna').then(m => m.StronaGlowna)
  },
  {
    path: 'logowanie',
    loadComponent: () => import('./logowanie/logowanie').then(m => m.Logowanie)
  },
  {
    path: 'aplikuj',
    loadComponent: () => import('./aplikuj/aplikuj').then(m => m.AplikujComponent)
  },
  {
    path: 'polityka-prywatnosci',
    loadComponent: () => import('./polityka-prywatnosci/polityka-prywatnosci').then(m => m.PolitykaPrywatnosci)
  },
  {
    path: 'oferty-pracy',
    loadComponent: () => import('./oferty-pracy/oferty-pracy').then(m => m.OfertyPracy)
  },
];
