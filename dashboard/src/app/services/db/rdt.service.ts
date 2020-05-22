import { Injectable } from '@angular/core';

import { DBService } from './db.service.interface';
import { Database, Doc, ExistingDoc } from '../../models/domain.model';
import { EventEmitter } from '@angular/core';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class RdtService implements DBService {

  private rdtDB = Database.rdt_tests;

  constructor(private dbService: PouchDBService) {
    this.instance();
  }

  instance() {
    return this.dbService.instance(this.rdtDB);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(this.rdtDB);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(this.rdtDB);
  }

  getAll() {
    this.instance().allDocs({
      include_docs: true,
      startkey: 'province:1:district:1',
      endkey: 'province:7:district:77',
      limit: 80,
    });
  }

  get(id: string): Promise<any> {
    return this.dbService.get(this.rdtDB, id);
  }

  create(doc: ExistingDoc): Promise<any> {
    return this.dbService.create(this.rdtDB, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(this.rdtDB, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(this.rdtDB, doc);
  }
}
