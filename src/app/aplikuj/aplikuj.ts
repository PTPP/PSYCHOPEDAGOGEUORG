import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrzyciskPowrotu } from '../przycisk-powrotu/przycisk-powrotu';

@Component({
  selector: 'app-aplikuj',
  templateUrl: './aplikuj.html',
  styleUrls: ['./aplikuj.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrzyciskPowrotu]
})
export class Aplikuj {

}
