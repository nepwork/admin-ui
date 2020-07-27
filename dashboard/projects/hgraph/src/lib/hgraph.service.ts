import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HgraphService {

  private id: string;
  private nodes: Node[];

  constructor() { }
}
