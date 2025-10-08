import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrzyciskPowrotu } from '../przycisk-powrotu/przycisk-powrotu';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logowanie',
  templateUrl: './logowanie.html',
  styleUrls: ['./logowanie.css'],
  imports: [PrzyciskPowrotu, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logowanie {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  loginForm: FormGroup;
  activeTab = signal('candidate');

  constructor() {
    this.loginForm = this.fb.group({
      candidateId: ['', [Validators.required]],
    });
  }

  setActiveTab(tab: 'candidate' | 'hr') {
    this.activeTab.set(tab);
    if (tab === 'candidate') {
      this.loginForm.reset();
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(`Logowanie kandydata z ID:`, this.loginForm.value.candidateId);
      // Logika logowania kandydata
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }
}
