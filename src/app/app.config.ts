
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// Importy Firebase z @angular/fire
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

// Import konfiguracji Firebase ze środowiska
import { environment } from './environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // --- Konfiguracja Firebase ---
    // 1. Inicjalizacja aplikacji Firebase przy użyciu konfiguracji z environment.ts
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // 2. Udostępnienie instancji Cloud Firestore
    provideFirestore(() => getFirestore()),

    // 3. Udostępnienie instancji Cloud Storage
    provideStorage(() => getStorage()),
  ],
};
