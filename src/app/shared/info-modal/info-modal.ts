import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.html',
  styleUrls: ['./info-modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class InfoModalComponent {
  // Istniejące inputy
  message = input.required<string>();
  icon = input<string>('info');
  show = input.required<boolean>();

  // Nowe inputy do obsługi przycisków akcji
  showConfirmButton = input<boolean>(false);
  showRejectButton = input<boolean>(false);
  confirmButtonText = input<string>('OK');
  rejectButtonText = input<string>('Anuluj');

  // Istniejący output
  close = output<void>();

  // Nowe outputy dla akcji
  confirm = output<void>();
  reject = output<void>();

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onReject(): void {
    this.reject.emit();
  }
}
