import { Injectable } from '@angular/core';

import { DBService } from '../../models/db.service.model';
import { Database, Doc, ExistingDoc } from '../../models/domain.model';
import { EventEmitter } from '@angular/core';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class RdtService implements DBService {

  constructor(private dbService: PouchDBService) {
    this.instantiate();
  }

  instantiate() {
    this.dbService.instantiate(Database.rdt_tests);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(Database.rdt_tests);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(Database.rdt_tests);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(Database.rdt_tests, id);
  }

  create(doc: Doc): Promise<any> {
    return this.dbService.create(Database.rdt_tests, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(Database.rdt_tests, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(Database.rdt_tests, doc);
  }
}
