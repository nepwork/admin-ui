import { Injectable } from '@angular/core';

import { DBService } from '../../models/db.service.interface';
import { Database, Doc, ExistingDoc } from '../../models/domain.model';
import { EventEmitter } from '@angular/core';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root',
})
export class CovidSimTeamService implements DBService {

  private teamDB = Database.covidsimteam;

  constructor(private dbService: PouchDBService) {
    this.instantiate();
  }

  instantiate() {
    this.dbService.instantiate(this.teamDB);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(this.teamDB);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(this.teamDB);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(this.teamDB, id);
  }

  create(doc: Doc): Promise<any> {
    return this.dbService.create(this.teamDB, doc);
  }

  update(doc: ExistingDoc): Promise<any> {
    return this.dbService.update(this.teamDB, doc);
  }

  delete(doc: ExistingDoc): Promise<any> {
    return this.dbService.delete(this.teamDB, doc);
  }
}
