import { Injectable } from '@angular/core';

import { DBService } from './db.service.interface';
import { Database, Doc, ExistingDoc } from '../../models/domain.model';
import { EventEmitter } from '@angular/core';
import { PouchDBService } from './pouchdb.service';
import { AllDocs, PSchema, PCRTuple } from '../../models/db-response.model';

@Injectable({
  providedIn: 'root',
})
export class PcrService implements DBService {

  private pcrDB = Database.pcr_tests;

  constructor(private dbService: PouchDBService) {
    this.instance();
    this.remoteSync();
  }

  instance() {
    return this.dbService.instance(this.pcrDB);
  }

  async getAll(startkey = 'province:1:district:1', endkey = 'province:7:district:77' ): Promise<AllDocs.Root> {
    const requestQuery = {
      include_docs: true,
      startkey,
      endkey,
      limit: 80,
    };
    const locAllDocs = await this.instance().allDocs(requestQuery) as AllDocs.Root;

    if (locAllDocs.rows.length !== 0) return locAllDocs;

    return await this.dbService.getRemoteDBInstance(this.pcrDB).allDocs(requestQuery) as AllDocs.Root;
  }

  async getAllDistricts(): Promise<Array<PCRTuple>> {
    try {
      const response = await this.getAll();
      return response.rows.map(row => row.doc.fields);
    } catch (error) {
      throw Error('District test data could not be fetched');
    }
  }

  async getTableHeaders(current = 'pschema:pcrs:v8'): Promise<string[][]> {
    try {
      const response = await this.get(current) as PSchema; // TODO add to couchdb-bootstrap repo
      return response.fields;
    } catch (error) {
      throw Error('PCR tests table headers could not be fetched');
    }
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

  create(doc: ExistingDoc): Promise<any> {
    return this.dbService.create(this.pcrDB, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(this.pcrDB, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(this.pcrDB, doc);
  }
}
