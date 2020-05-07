import { EventEmitter, Injectable } from '@angular/core';
import { DBService } from '../../models/db.service.model';
import { Database } from '../../models/domain.model';
import { PouchDBService } from './pouchdb.service';


@Injectable({
  providedIn: 'root',
})
export class SpatialService implements DBService {

  constructor(private dbService: PouchDBService) { }

  instantiate() {
    this.dbService.instantiate(Database.spatial);
  }

  remoteSync(): EventEmitter<any> {
    return this.dbService.remoteSync(Database.spatial);
  }

  getChangeListener(): EventEmitter<any> {
    return this.dbService.getChangeListener(Database.spatial);
  }

  get(id: string): Promise<any> {
    return this.dbService.get(Database.spatial, id);
  }

}
