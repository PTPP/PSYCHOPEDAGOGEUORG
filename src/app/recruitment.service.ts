import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Definicja typu dla danych aplikacji
// Usunęliśmy pola base64, bo nie są już potrzebne
export interface ApplicationData {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  rola: string;
  przedstawSie: string;
  motywacja: string;
  cv: File | null;
  listMotywacyjny: File | null;
}

// Definicja typu dla danych zapisywanych w Firestore
export interface CandidateDocument {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  rola: string;
  przedstawSie: string;
  motywacja: string;
  cvUrl: string | null; // Link do pliku w Storage
  listMotywacyjnyUrl: string | null; // Link do pliku w Storage
  dataAplikacji: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  submitApplication(payload: ApplicationData): Observable<any> {
    // Krok 1: Przesyłanie plików (jeśli istnieją)
    const cvUpload$ = payload.cv
      ? this.uploadFile(payload.cv, 'cv-files')
      : of(null);

    const lmUpload$ = payload.listMotywacyjny
      ? this.uploadFile(payload.listMotywacyjny, 'lm-files')
      : of(null);

    // Krok 2: Czekamy na zakończenie przesyłania obu plików
    return forkJoin([cvUpload$, lmUpload$]).pipe(
      switchMap(([cvUrl, lmUrl]) => {
        // Krok 3: Tworzymy dokument do zapisu w Firestore
        const candidateData: CandidateDocument = {
          imie: payload.imie,
          nazwisko: payload.nazwisko,
          email: payload.email,
          telefon: payload.telefon,
          rola: payload.rola,
          przedstawSie: payload.przedstawSie,
          motywacja: payload.motywacja,
          cvUrl: cvUrl,
          listMotywacyjnyUrl: lmUrl,
          dataAplikacji: new Date(),
        };

        // Krok 4: Zapisujemy dane do kolekcji 'candidates'
        const candidatesCollection = collection(this.firestore, 'candidates');
        return from(addDoc(candidatesCollection, candidateData));
      })
    );
  }

  // Prywatna metoda do przesyłania pliku i pobierania jego URL
  private uploadFile(file: File, path: string): Observable<string> {
    // Tworzymy unikalną ścieżkę dla każdego pliku
    const filePath = `${path}/${new Date().getTime()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = from(uploadBytes(storageRef, file));

    // Po przesłaniu pliku, pobieramy jego URL
    return uploadTask.pipe(
      switchMap(() => from(getDownloadURL(storageRef)))
    );
  }
}
