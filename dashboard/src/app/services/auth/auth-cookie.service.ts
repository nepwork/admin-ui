import { Injectable } from '@angular/core';
import { Database, Doc } from '../../models/domain.model';
import { PouchDBService } from '../db/pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class AuthCookieService {

  private auditDB = Database.audit;
  private currentCookieId: string;

  constructor(private dbService: PouchDBService) {
    this.dbService.instantiate(this.auditDB);
  }

  async get(): Promise<any> {
    if (!this.currentCookieId) return Promise.reject();
    return this.dbService.get(this.auditDB, this.currentCookieId);
  }

  async create(doc: Doc): Promise<any> {
    delete doc._id;
    try {
      const created = await this.dbService.create(this.auditDB, doc);
      console.log('AuthCookieService -> created', created);
      const { _id } = created;
      this.currentCookieId = _id;
    } catch (error) {
      return Promise.reject();
    }
  }
}
