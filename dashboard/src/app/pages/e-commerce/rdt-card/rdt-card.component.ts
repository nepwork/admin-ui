import { Component } from '@angular/core';

@Component({
  selector: 'ngx-rdt-card',
  styleUrls: ['./rdt-card.component.scss'],
  templateUrl: './rdt-card.component.html',
})
export class RdtCardComponent {

  flipped = false;

  toggleView() {
    this.flipped = !this.flipped;
  }
}
