import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrzyciskPowrotu } from '../przycisk-powrotu/przycisk-powrotu';

@Component({
  selector: 'app-oferty-pracy',
  templateUrl: './oferty-pracy.html',
  styleUrls: ['./oferty-pracy.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrzyciskPowrotu]
})
export class OfertyPracy {

}
