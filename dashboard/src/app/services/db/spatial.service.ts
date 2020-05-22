import { EventEmitter, Injectable } from '@angular/core';
import { DBService } from './db.service.interface';
import { Database } from '../../models/domain.model';
import { PouchDBService } from './pouchdb.service';


@Injectable({
  providedIn: 'root',
})
export class SpatialService implements DBService {

  constructor(private dbService: PouchDBService) {
    this.instance();
  }

  instance() {
    this.dbService.instance(Database.spatial);
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
