import { Injectable } from '@angular/core';

import { DBService } from '../../models/db.service.model';
import { Database, Doc, ExistingDoc } from '../../models/domain.model';
import { EventEmitter } from '@angular/core';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class ReturneeService implements DBService {

  constructor(private dbService: PouchDBService) { }

  instantiate() {
    this.dbService.instantiate(Database.returnees);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(Database.returnees);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(Database.returnees);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(Database.returnees, id);
  }

  create(doc: Doc): Promise<any> {
    return this.dbService.create(Database.returnees, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(Database.returnees, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(Database.returnees, doc);
  }
}
