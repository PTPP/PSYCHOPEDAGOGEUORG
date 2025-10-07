import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrzyciskPowrotu } from '../przycisk-powrotu/przycisk-powrotu';

@Component({
  selector: 'app-tpp',
  templateUrl: './tpp.html',
  styleUrls: ['./tpp.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrzyciskPowrotu]
})
export class Tpp {

}
