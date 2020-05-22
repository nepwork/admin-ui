import { EventEmitter, Injectable } from '@angular/core';
import { Database, ExistingDoc } from '../../models/domain.model';
import { DBService } from './db.service.interface';
import { PouchDBService } from './pouchdb.service';


@Injectable({
  providedIn: 'root',
})
export class ReturneeService implements DBService {

  private returneeDB = Database.returnees;

  constructor(private dbService: PouchDBService) {
    this.instance();
  }

  instance() {
    this.dbService.instance(this.returneeDB);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(this.returneeDB);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(this.returneeDB);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(this.returneeDB, id);
  }

  create(doc: ExistingDoc): Promise<any> {
    return this.dbService.create(this.returneeDB, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(this.returneeDB, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(this.returneeDB, doc);
  }
}
