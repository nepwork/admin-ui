import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  private idStr: IdStream;

  constructor() { }

  set id(id: IdStream) {
    this.idStr = id;
  }

  get id(): IdStream {
    return this.idStr;
  }
}
