import { Injectable } from '@angular/core';
import { Node } from 'projects/model/node.model';
import { Observable } from 'rxjs';

export type Idx = string | Node;
@Injectable({
  providedIn: 'root'
})
export class EntityService<T extends Idx> {

  private idx: Observable<Idx>;
  private values: Observable<Array<T>>;

  constructor() { }

  get id(): Observable<Idx> { return this.idx; }

  set id(id: Observable<Idx>) { this.idx = id; }

  get val(): Observable<T[]> { return this.values; }

  set val(headers: Observable<T[]>) { this.values = headers; }

}
