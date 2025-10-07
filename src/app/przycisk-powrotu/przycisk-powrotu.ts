import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-przycisk-powrotu',
  templateUrl: './przycisk-powrotu.html',
  styleUrls: ['./przycisk-powrotu.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrzyciskPowrotu {
  goBack(): void {
    history.back();
  }
}
