import { PaymentStream } from './model/payment.stream';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private id: PaymentStream;

  constructor() { }

  set pay(payment: PaymentStream) { this.id = payment; }

  get pay(): PaymentStream { return this.id; }
}
