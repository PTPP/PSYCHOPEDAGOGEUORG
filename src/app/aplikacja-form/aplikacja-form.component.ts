import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecruitmentService } from '../recruitment.service';
import { matchValidator } from '../utils/match-validator';
import { InfoModalComponent } from '../shared/info-modal/info-modal';
import { PrzyciskPowrotu } from '../przycisk-powrotu/przycisk-powrotu';

@Component({
  selector: 'app-aplikacja-form',
  templateUrl: './aplikacja-form.html',
  styleUrls: ['./aplikacja-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, InfoModalComponent, PrzyciskPowrotu]
})
export class AplikacjaFormComponent {
  applicationForm;

  cvFile = signal<File | null>(null);
  listMotywacyjnyFile = signal<File | null>(null);
  cvFileName = computed(() => this.cvFile()?.name || null);
  listMotywacyjnyFileName = computed(() => this.listMotywacyjnyFile()?.name || null);
  cvError = signal<string | null>(null);
  motywacyjnyError = signal<string | null>(null);
  submissionStatus = signal<'idle' | 'pending' | 'success' | 'error'>('idle');
  submissionError = signal<string | null>(null);

  mathQuestion = signal({ num1: 0, num2: 0, answer: 0 });

  constructor(private fb: FormBuilder, private recruitmentService: RecruitmentService) {
    this.applicationForm = this.fb.group({
      imie: ['', Validators.required],
      nazwisko: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, matchValidator('email')]],
      telefon: ['', Validators.required],
      rola: ['', Validators.required],
      opisSiebie: ['', Validators.required],
      motywacja: ['', Validators.required],
      zgodaPrzetwarzanie: [false, Validators.requiredTrue],
      mathAnswer: ['', Validators.required],
      honeypot: ['']
    });

    this.generateMathQuestion();
    this.applicationForm.get('mathAnswer')?.valueChanges.subscribe(value => {
      if (String(value) !== String(this.mathQuestion().answer)) {
        this.applicationForm.get('mathAnswer')?.setErrors({ wrongAnswer: true });
      } else {
        this.applicationForm.get('mathAnswer')?.setErrors(null);
      }
    });
  }

  generateMathQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    this.mathQuestion.set({ num1, num2, answer: num1 + num2 });
  }

  triggerFileInput(id: string) {
    document.getElementById(id)?.click();
  }

  onFileSelected(event: Event, fileType: 'cv' | 'listMotywacyjny') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];

        if (file.size > maxSize) {
            const errorMsg = 'Plik jest za duży. Maksymalny rozmiar to 2MB.';
            if (fileType === 'cv') {
                this.cvError.set(errorMsg);
                this.cvFile.set(null);
            } else {
                this.motywacyjnyError.set(errorMsg);
                this.listMotywacyjnyFile.set(null);
            }
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            const errorMsg = 'Niedozwolony typ pliku. Dozwolone formaty: PDF, DOCX, JPG, PNG.';
            if (fileType === 'cv') {
                this.cvError.set(errorMsg);
                this.cvFile.set(null);
            } else {
                this.motywacyjnyError.set(errorMsg);
                this.listMotywacyjnyFile.set(null);
            }
            return;
        }

        if (fileType === 'cv') {
            this.cvFile.set(file);
            this.cvError.set(null);
        } else {
            this.listMotywacyjnyFile.set(file);
            this.motywacyjnyError.set(null);
        }
    }
  }

  removeFile(fileType: 'cv' | 'listMotywacyjny') {
    if (fileType === 'cv') {
      this.cvFile.set(null);
    } else {
      this.listMotywacyjnyFile.set(null);
    }
  }

  async onSubmit() {
    this.applicationForm.markAllAsTouched();

    if (this.applicationForm.invalid || !this.cvFile()) {
        if (!this.cvFile()) {
            this.cvError.set('CV jest wymagane.');
        }
        return;
    }

    if (this.applicationForm.get('honeypot')?.value) {
        console.log('Honeypot triggered');
        return;
    }

    this.submissionStatus.set('pending');

    try {
      const formValue = this.applicationForm.value;
      await this.recruitmentService.submitApplication({
        imie: formValue.imie || '',
        nazwisko: formValue.nazwisko || '',
        email: formValue.email || '',
        telefon: formValue.telefon || '',
        rola: formValue.rola || '', 
        opisSiebie: formValue.opisSiebie || '',
        motywacja: formValue.motywacja || '',
        zgodaPrzetwarzanie: formValue.zgodaPrzetwarzanie || false,
        cv: this.cvFile(),
        listMotywacyjny: this.listMotywacyjnyFile(),
        status: 'Nowa',
        dataAplikacji: new Date().toISOString()
      });

      this.submissionStatus.set('success');
      this.resetForm();

    } catch (error) {
      console.error('Błąd przesyłania aplikacji:', error);
      this.submissionError.set(error instanceof Error ? error.message : 'Wystąpił nieznany błąd.');
      this.submissionStatus.set('error');
    }
  }

  resetForm() {
    this.applicationForm.reset();
    this.cvFile.set(null);
    this.listMotywacyjnyFile.set(null);
    this.cvError.set(null);
    this.motywacyjnyError.set(null);
    this.generateMathQuestion();
  }

  closeModal() {
    this.submissionStatus.set('idle');
  }
}
