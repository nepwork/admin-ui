import { EventEmitter, Injectable } from '@angular/core';
import { AllDocs, PCRTuple, PSchema } from '../../models/db-response.model';
import { Database, ExistingDoc } from '../../models/domain.model';
import { DBService } from './db.service.interface';
import { PouchDBService } from './pouchdb.service';


@Injectable({
  providedIn: 'root',
})
export class PcrService implements DBService {

  private pcrDB = Database.pcr_tests;

  private pcrHeaders_: string[][];

  constructor(private dbService: PouchDBService) {
    this.instance();
    this.remoteSync();
  }

  instance() {
    return this.dbService.instance(this.pcrDB);
  }

  get headers(): string[][] { return this.pcrHeaders_; }

  async getAll(startkey = 'province:', endkey = 'province:\ufff0'): Promise<AllDocs.Root> {
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
      throw Error('District-wise PCR test data could not be fetched');
    }
  }

  async getTableHeaders(current = 'pschema:pcrs:v8'): Promise<string[][]> {
    if (this.pcrHeaders_) return Promise.resolve(this.pcrHeaders_);
    try {
      const response = await this.get(current) as PSchema; // TODO add to couchdb-bootstrap repo
      return (this.pcrHeaders_ = response.fields);
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
