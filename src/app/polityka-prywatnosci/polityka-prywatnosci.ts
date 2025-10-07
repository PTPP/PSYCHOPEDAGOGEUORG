import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrzyciskPowrotu } from '../przycisk-powrotu/przycisk-powrotu';

@Component({
  selector: 'app-polityka-prywatnosci',
  templateUrl: './polityka-prywatnosci.html',
  styleUrls: ['./polityka-prywatnosci.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrzyciskPowrotu]
})
export class PolitykaPrywatnosci { }
