import { Injectable } from '@angular/core';

// TODO

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {

  constructor() { }

  get authUri(): String { return 'http://mockhost'; }

  get dbUri(): string { return 'http://mockhost'; }
}
