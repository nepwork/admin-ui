import { Component } from '@angular/core';

@Component({
  selector: 'ngx-pcr-card',
  styleUrls: ['./pcr-card.component.scss'],
  templateUrl: './pcr-card.component.html',
})
export class PcrCardComponent {

  flipped = false;

  toggleView() {
    this.flipped = !this.flipped;
  }
}
