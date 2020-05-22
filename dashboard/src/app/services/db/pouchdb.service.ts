import { EventEmitter, Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchAuth from 'pouchdb-authentication';
import { Database, DBList, Doc, ExistingDoc } from '../../models/domain.model';
import { AuthService } from '../auth/auth.service';
import { EnvironmentService } from '../env/environment.service';
import { LoggingService } from '../logging.service';

PouchDB.plugin(PouchAuth);

@Injectable({
  providedIn: 'root',
})
export class PouchDBService {

  private databases: DBList = {};

  constructor(
    private environment: EnvironmentService,
    private logger: LoggingService,
    private authService: AuthService) {
    Object.values(Database).forEach(dbName => {
      this.databases[dbName] = { name: dbName, listener: new EventEmitter() };
    });
  }

  public instance(dbName: Database): PouchDB.Database {
    if (this.getDBInstance(dbName)) return this.getDBInstance(dbName);
    return (this.databases[dbName].instance = new PouchDB(this.databases[dbName].name));
  }

  private getDBInstance(dbName: Database): PouchDB.Database {
    return this.databases[dbName].instance;
  }

  public getRemoteDBInstance(dbName: Database): PouchDB.Database {
    return this.databases[dbName].remoteInstance;
  }

  public getChangeListener(dbName: Database): EventEmitter<any> {
    return this.databases[dbName].listener;
  }

  public async get(dbName: Database, id: string): Promise<any> {
    try {
      const localResponse = await this.getDBInstance(dbName).get(id);
      return localResponse;
    } catch (error) {
      const remoteResponse = this.getRemoteDBInstance(dbName).get(id);
      return remoteResponse;
    }
  }

  public async createUsingPost(dbName: Database, doc: Doc): Promise<any> {
    const dbInstance = this.getDBInstance(dbName);
    try {
      return await dbInstance.post(doc);
    } catch (error) {
      return new Promise((_, reject) => reject(error));
    }
  }

  public async create(dbName: Database, doc: ExistingDoc): Promise<any> {
    const dbInstance = this.getDBInstance(dbName);
    try {
      return await dbInstance.put(doc);
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
    try {
      const result = await this.get(dbName, doc._id);
      doc._rev = result._rev;
      doc._deleted = true;
      return this.update(dbName, doc);
    } catch (error) {
      return new Promise((_, reject) => reject(error));
    }
  }

    // tslint:disable: no-console
    public remoteSync(dbName: Database): EventEmitter<any> {

      if (this.getRemoteDBInstance(dbName)) return this.getChangeListener(dbName);

      const dbMeta = this.databases[dbName];
      const remoteDB = new PouchDB(`${this.environment.dbUri}/${dbName}`, { skip_setup: true });

      if (!this.authService.isAuthenticated) return;

      (async () => await remoteDB.logIn(this.authService.user, this.authService.pass).then(function(res: any) {
      }))();

      const localDB = dbMeta.instance ? dbMeta.instance : this.instance(dbName);

      const emitOnChange = (change: any) => dbMeta.listener.emit(change);

      localDB.sync(remoteDB, { live: true })
            .on('change', emitOnChange)
            .on('complete', emitOnChange)
            .on('error', (err: any) => this.logger.error(err));

      this.databases[dbName].remoteInstance = remoteDB;
      this.databases[dbName].listener = dbMeta.listener;

      return dbMeta.listener;
    }


}
