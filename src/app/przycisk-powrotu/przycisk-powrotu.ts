import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-przycisk-powrotu',
  templateUrl: './przycisk-powrotu.html',
  styleUrls: ['./przycisk-powrotu.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule] // Dodano import
})
export class PrzyciskPowrotu {
  goBack(): void {
    history.back();
  }
}
