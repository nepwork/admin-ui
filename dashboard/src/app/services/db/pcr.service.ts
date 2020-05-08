import { Injectable } from '@angular/core';

import { DBService } from '../../models/db.service.model';
import { Database, Doc, ExistingDoc } from '../../models/domain.model';
import { EventEmitter } from '@angular/core';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class PcrService implements DBService {

  constructor(private dbService: PouchDBService) {
    this.instantiate();
  }

  instantiate() {
    this.dbService.instantiate(Database.pcr_tests);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(Database.pcr_tests);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(Database.pcr_tests);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(Database.pcr_tests, id);
  }

  create(doc: Doc): Promise<any> {
    return this.dbService.create(Database.pcr_tests, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(Database.pcr_tests, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(Database.pcr_tests, doc);
  }
}
