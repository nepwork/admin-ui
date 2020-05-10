import { Injectable } from '@angular/core';

import { DBService } from '../../models/db.service.model';
import { Database, Doc, ExistingDoc } from '../../models/domain.model';
import { EventEmitter } from '@angular/core';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class RdtService implements DBService {

  private rdtDB = Database.rdt_tests;

  constructor(private dbService: PouchDBService) {
    this.instantiate();
  }

  instantiate() {
    this.dbService.instantiate(this.rdtDB);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(this.rdtDB);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(this.rdtDB);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(this.rdtDB, id);
  }

  create(doc: Doc): Promise<any> {
    return this.dbService.create(this.rdtDB, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(this.rdtDB, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(this.rdtDB, doc);
  }
}
