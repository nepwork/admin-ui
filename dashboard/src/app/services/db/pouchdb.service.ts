import { Injectable, EventEmitter } from '@angular/core';

import PouchDB from 'pouchdb';
import { DBList, Database, ExistingDoc, Doc } from '../../models/domain.model';
import { EnvironmentService } from '../env/environment.service';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root',
})
export class PouchDBService {

  private databases: DBList = {};

  constructor(private environment: EnvironmentService, private logger: LoggingService) {
    Object.values(Database).forEach(dbName => {
      this.databases[dbName] = { name: dbName, listener: new EventEmitter() };
    });
  }

  public instantiate(dbName: Database) {
    if (this.getDBInstance(dbName)) return this.getDBInstance(dbName);
    return this.databases[dbName].instance = new PouchDB(this.databases[dbName].name);
  }

  private getDBInstance(dbName: Database) {
    return this.databases[dbName].instance;
  }

  public remoteSync(dbName: Database): EventEmitter<any> {
    const dbMeta = this.databases[dbName];

    const remoteDB = new PouchDB(`${this.environment.dbUri}/${dbName}`);
    const localDB = dbMeta.instance ? dbMeta.instance : this.instantiate(dbName);

    const emitOnChange = (change: any) => dbMeta.listener.emit(change);

    localDB.sync(remoteDB, { live: true })
          .on('change', emitOnChange)
          .on('complete', emitOnChange)
          .on('error', (err: any) => this.logger.error(err));

    return dbMeta.listener;
  }

  public getChangeListener(dbName: Database): EventEmitter<any> {
    return this.databases[dbName].listener;
  }

  public get(dbName: Database, id: string): Promise<any> {
    return this.databases[dbName].instance.get(id);
  }

  public async create(dbName: Database, doc: Doc): Promise<any> {
    const dbInstance = this.getDBInstance(dbName);
    try {
      return await dbInstance.post(doc);
    } catch (error) {
      return new Promise((_, reject) => reject(error));
    }
  }

  public async update(dbName: Database, doc: ExistingDoc): Promise<any> {
    const dbInstance = this.getDBInstance(dbName);
    try {
      const result = await this.get(dbName, doc._id);
      doc._rev = result._rev;
      return dbInstance.put(doc);
    } catch (error) {
      if (error.status === '404')
        return dbInstance.put(doc);
      return new Promise((_, reject) => reject(error));
    }
  }

  public async delete(dbName: Database, doc: ExistingDoc): Promise<any> {
    const dbInstance = this.getDBInstance(dbName);
    try {
      const result = await this.get(dbName, doc._id);
      doc._rev = result._rev;
      return dbInstance.delete(doc);
    } catch (error) {
      return new Promise((_, reject) => reject(error));
    }
  }

}
