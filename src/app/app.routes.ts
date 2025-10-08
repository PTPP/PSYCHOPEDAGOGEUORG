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
    path: 'aplikacja', // Zmieniona ścieżka
    loadComponent: () => import('./aplikacja-form/aplikacja-form.component').then(m => m.AplikacjaFormComponent)
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
