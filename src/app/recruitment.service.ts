import { Injectable, inject } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { ref, uploadBytes, getDownloadURL, Storage } from '@angular/fire/storage';

export interface ApplicationData {
  imie: string;
  nazwisko: string; 
  email: string;
  telefon: string;
  rola: string;
  opisSiebie: string;
  motywacja: string; 
  zgodaPrzetwarzanie: boolean;
  cv: File | null;
  listMotywacyjny: File | null;
  status: string;
  dataAplikacji: string;
  cvUrl?: string; 
  listMotywacyjnyUrl?: string;
  keywords?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  async submitApplication(applicationData: ApplicationData): Promise<void> {
    try {
      let cvUrl = null;
      if (applicationData.cv) {
        cvUrl = await this.uploadFile(applicationData.cv, 'cv-files');
      }

      let listMotywacyjnyUrl = null;
      if (applicationData.listMotywacyjny) {
        listMotywacyjnyUrl = await this.uploadFile(applicationData.listMotywacyjny, 'motywacyjny-files');
      }

      const keywords = [
        applicationData.imie.toLowerCase(),
        applicationData.nazwisko.toLowerCase(),
        applicationData.email.toLowerCase(),
        applicationData.telefon.toLowerCase(),
        applicationData.rola.toLowerCase()
      ].filter(Boolean); 

      const applicationPayload = {
        ...applicationData,
        cvUrl,
        listMotywacyjnyUrl,
        cv: null, 
        listMotywacyjny: null,
        keywords
      };

      const docRef = await addDoc(collection(this.firestore, 'candidates'), applicationPayload);
      console.log('Aplikacja została pomyślnie wysłana. ID dokumentu:', docRef.id);
    } catch (error) {
      console.error('Błąd podczas dodawania dokumentu aplikacji:', error);
      throw new Error('Nie udało się wysłać aplikacji. Spróbuj ponownie.');
    }
  }

  private async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, `${path}/${new Date().getTime()}_${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
  }
}
