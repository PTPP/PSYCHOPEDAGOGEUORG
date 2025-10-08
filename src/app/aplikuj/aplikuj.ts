import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { matchValidator } from '../utils/match-validator';
import { createE164PhoneNumber } from '../utils/phone-number-formatter';
import { createMathQuestion, mathAnswerValidator } from '../utils/math-question-validator';
import { PrzyciskPowrotu } from '../przycisk-powrotu/przycisk-powrotu';
import { InfoModalComponent } from '../shared/info-modal/info-modal';
import { RecruitmentService, ApplicationData } from '../recruitment.service'; // Importujemy nowy serwis i interfejs

@Component({
  selector: 'app-aplikuj',
  templateUrl: './aplikuj.html',
  styleUrls: ['./aplikuj.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PrzyciskPowrotu, InfoModalComponent],
})
export class AplikujComponent {
  private fb = inject(FormBuilder);
  private recruitmentService = inject(RecruitmentService); // Wstrzykujemy nowy serwis

  public mathQuestion = signal(createMathQuestion());
  public submissionStatus: WritableSignal<'idle' | 'success' | 'error'> = signal('idle');
  public isSubmitting = signal(false);
  public selectedCvFile = signal<File | null>(null);
  public selectedMotivationFile = signal<File | null>(null);
  public showSaveModal = signal(false);
  public showLoadDraftModal = signal(false);

  public applicationForm = this.fb.group({
    imie: ['', Validators.required],
    nazwisko: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    confirmEmail: ['', [Validators.required, matchValidator('email')]],
    telefon: ['', Validators.required],
    przedstawSie: ['', Validators.required],
    motywacja: ['', Validators.required],
    rola: ['', Validators.required],
    cv: [null as string | null, Validators.required],
    listMotywacyjny: [null as string | null],
    zgodaRodo: [false, Validators.requiredTrue],
    mathAnswer: [null, [Validators.required, mathAnswerValidator(this.mathQuestion())]],
    honeypot: [''],
  });

  public f = this.applicationForm.controls;

  constructor() {
    this.checkForDraft();
  }

  checkForDraft(): void {
    const draft = localStorage.getItem('applicationFormDraft');
    if (draft) {
      this.showLoadDraftModal.set(true);
    }
  }

  onConfirmLoad(): void {
    this.applyDraft();
    this.showLoadDraftModal.set(false);
  }

  onRejectLoad(): void {
    localStorage.removeItem('applicationFormDraft');
    this.showLoadDraftModal.set(false);
  }

  private applyDraft(): void {
    const draft = localStorage.getItem('applicationFormDraft');
    if (!draft) return;

    const parsedDraft = JSON.parse(draft);
    if (parsedDraft.cv) {
      this.applicationForm.patchValue({ cv: parsedDraft.cv });
    }
    if (parsedDraft.listMotywacyjny) {
      this.applicationForm.patchValue({ listMotywacyjny: parsedDraft.listMotywacyjny });
    }
    delete parsedDraft.cv;
    delete parsedDraft.listMotywacyjny;
    this.applicationForm.patchValue(parsedDraft);
  }

  onFileChange(event: Event, controlName: 'cv' | 'listMotywacyjny'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (controlName === 'cv') {
        this.selectedCvFile.set(file);
        this.applicationForm.patchValue({ cv: file.name });
      } else if (controlName === 'listMotywacyjny') {
        this.selectedMotivationFile.set(file);
        this.applicationForm.patchValue({ listMotywacyjny: file.name });
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.applicationForm.invalid || this.f.honeypot.value) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submissionStatus.set('idle');

    try {
      const formData = this.applicationForm.getRawValue();

      // Przygotowujemy ładunek zgodny z interfejsem ApplicationData
      const payload: ApplicationData = {
        imie: formData.imie ?? '',
        nazwisko: formData.nazwisko ?? '',
        email: formData.email ?? '',
        telefon: createE164PhoneNumber(formData.telefon ?? ''),
        rola: formData.rola ?? '',
        przedstawSie: formData.przedstawSie ?? '',
        motywacja: formData.motywacja ?? '',
        cv: await this.fileToBase64(this.selectedCvFile()),
        cvFileName: this.selectedCvFile()?.name,
        listMotywacyjny: await this.fileToBase64(this.selectedMotivationFile()),
        listMotywacyjnyFileName: this.selectedMotivationFile()?.name,
      };

      // Wywołujemy metodę z serwisu
      this.recruitmentService.submitApplication(payload).subscribe({
        next: (response) => {
          console.log('Odpowiedź z GAS:', response);
          this.submissionStatus.set('success');
          this.clearForm(true);
          localStorage.removeItem('applicationFormDraft');
        },
        error: (error) => {
          console.error('Błąd wysyłania przez serwis:', error);
          this.submissionStatus.set('error');
        },
        complete: () => this.isSubmitting.set(false)
      });

    } catch (error) {
      console.error('Błąd podczas przetwarzania formularza lub plików:', error);
      this.isSubmitting.set(false);
      this.submissionStatus.set('error');
    }
  }

  clearForm(submitted = false): void {
    this.applicationForm.reset();
    this.selectedCvFile.set(null);
    this.selectedMotivationFile.set(null);
    this.mathQuestion.set(createMathQuestion());
    if (!submitted) {
      localStorage.removeItem('applicationFormDraft');
    }
  }

  saveToBrowser(): void {
    localStorage.setItem('applicationFormDraft', JSON.stringify(this.applicationForm.value));
    this.showSaveModal.set(true);
  }

  private fileToBase64(file: File | null): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]); // Zwracamy czysty base64
      reader.onerror = error => reject(error);
    });
  }
}
