import { Injectable } from '@angular/core';
import { DBService } from '../../models/db.service.model';
import { Database, Doc } from '../../models/domain.model';
import { PouchDBService } from '../db/pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class AuthCookieService implements DBService {

  private auditDB = Database.audit;

  constructor(private dbService: PouchDBService) {
    this.instantiate();
  }

  instantiate() {
    this.dbService.instantiate(this.auditDB);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(this.auditDB, id);
  }

  create(doc: Doc): Promise<any> {
    return this.dbService.create(this.auditDB, doc);
  }
}
