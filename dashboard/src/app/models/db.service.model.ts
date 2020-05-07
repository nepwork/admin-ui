import { EventEmitter } from '@angular/core';
import { Doc, ExistingDoc } from './domain.model';

export interface DBService {
  instantiate(): any;
  remoteSync(): EventEmitter<any>;
  getChangeListener(): EventEmitter<any>;
  get(id: string): Promise<any>;
  create?(doc: Doc): Promise<any>;
  update?(doc: ExistingDoc): Promise<any>;
  delete?(doc: ExistingDoc): Promise<any>;
}
