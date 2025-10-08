import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecruitmentService, ApplicationData } from '../recruitment.service';
import { ZgodyComponent } from '../zgody/zgody.component';
import { PrzyciskPowrotuComponent } from '../przycisk-powrotu/przycisk-powrotu.component';

@Component({
  selector: 'app-aplikuj',
  templateUrl: './aplikuj.html',
  styleUrls: ['./aplikuj.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZgodyComponent,
    PrzyciskPowrotuComponent,
  ]
})
export class AplikujComponent {
  applicationForm = this.fb.group({
    imie: ['', Validators.required],
    nazwisko: [''],
    email: ['', [Validators.required, Validators.email]],
    telefon: [''],
    rola: [''],
    przedstawSie: [''],
    motywacja: [''],
    cv: [null as File | null, Validators.required],
    listMotywacyjny: [null as File | null]
  });

  cvFileName = signal<string | undefined>(undefined);
  listMotywacyjnyFileName = signal<string | undefined>(undefined);

  submissionStatus = signal<'idle' | 'pending' | 'success' | 'error'>('idle');
  submissionError = signal<string | null>(null);

  constructor(private fb: FormBuilder, private recruitmentService: RecruitmentService) {}

  onFileChange(event: Event, fileType: 'cv' | 'listMotywacyjny'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (fileType === 'cv') {
        this.applicationForm.patchValue({ cv: file });
        this.cvFileName.set(file.name);
      } else {
        this.applicationForm.patchValue({ listMotywacyjny: file });
        this.listMotywacyjnyFileName.set(file.name);
      }
    }
  }

  removeFile(fileType: 'cv' | 'listMotywacyjny'): void {
    if (fileType === 'cv') {
      this.applicationForm.patchValue({ cv: null });
      this.cvFileName.set(undefined);
    } else {
      this.applicationForm.patchValue({ listMotywacyjny: null });
      this.listMotywacyjnyFileName.set(undefined);
    }
  }

  resetForm(): void {
    this.applicationForm.reset();
    this.cvFileName.set(undefined);
    this.listMotywacyjnyFileName.set(undefined);
    this.submissionStatus.set('idle');
    this.submissionError.set(null);
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched(); // Oznaczamy wszystkie pola jako dotknięte
      return;
    }

    this.submissionStatus.set('pending');

    // Przygotowujemy dane, przekazując obiekty File bezpośrednio
    const applicationData: ApplicationData = {
      imie: this.applicationForm.value.imie || '',
      nazwisko: this.applicationForm.value.nazwisko || '',
      email: this.applicationForm.value.email || '',
      telefon: this.applicationForm.value.telefon || '',
      rola: this.applicationForm.value.rola || '',
      przedstawSie: this.applicationForm.value.przedstawSie || '',
      motywacja: this.applicationForm.value.motywacja || '',
      cv: this.applicationForm.get('cv')?.value || null,
      listMotywacyjny: this.applicationForm.get('listMotywacyjny')?.value || null,
    };

    this.recruitmentService.submitApplication(applicationData).subscribe({
      next: () => {
        this.submissionStatus.set('success');
        this.submissionError.set(null);
        this.applicationForm.reset();
        this.cvFileName.set(undefined);
        this.listMotywacyjnyFileName.set(undefined);
      },
      error: (err) => {
        console.error('Błąd podczas wysyłania aplikacji:', err);
        this.submissionStatus.set('error');
        this.submissionError.set(err.message || 'Wystąpił nieznany błąd serwera.');
      }
    });
  }
}
