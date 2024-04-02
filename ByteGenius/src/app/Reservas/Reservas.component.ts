import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './Reservas.component.html',
  styleUrl: './Reservas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservasComponent implements OnInit {

  ngOnInit(): void { }

}
