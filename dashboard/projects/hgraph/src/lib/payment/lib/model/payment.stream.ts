import { Observable } from 'rxjs';
export interface IdStream {
  id: Observable<string | unknown>;
}

export interface PaymentStream {
  id: Observable<IdStream | PaymentStream>;
}
