import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-strona-glowna',
  templateUrl: './strona-glowna.html',
  styleUrls: ['./strona-glowna.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class StronaGlowna { }
