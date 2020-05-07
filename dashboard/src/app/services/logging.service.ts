import { Injectable } from '@angular/core';

// TODO

@Injectable({
  providedIn: 'root',
})
export class LoggingService {

  constructor() { }

  public error(err: string) {
    console.error(JSON.stringify(err));
  }
}
