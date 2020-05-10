import { Injectable } from '@angular/core';

import { DBService } from '../../models/db.service.model';
import { Database, Doc, ExistingDoc } from '../../models/domain.model';
import { EventEmitter } from '@angular/core';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class PcrService implements DBService {

  private pcrDB = Database.pcr_tests;

  constructor(private dbService: PouchDBService) {
    this.instantiate();
  }

  instantiate() {
    this.dbService.instantiate(this.pcrDB);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(this.pcrDB);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(this.pcrDB);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(this.pcrDB, id);
  }

  create(doc: Doc): Promise<any> {
    return this.dbService.create(this.pcrDB, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(this.pcrDB, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(this.pcrDB, doc);
  }
}
