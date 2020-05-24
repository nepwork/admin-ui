import { EventEmitter } from '@angular/core';
import { RdtService } from '../services/db/rdt.service';
import { PcrService } from '../services/db/pcr.service';
import { ReturneeService } from '../services/db/returnee.service';

export interface DBList {
  [dbId: string]: {
    name: string,
    instance?: PouchDB.Database,
    remoteInstance?: PouchDB.Database,
    listener?: EventEmitter<any>,
  };
}

export enum Database {
  covidsimteam = 'covidsimteam',
  returnees = 'foreign_returnees',
  spatial = 'nepal_spatial',
  pcr_tests = 'pcr_tests',
  rdt_tests = 'rdt_tests',
  audit = 'usage_audit',
}

export interface ExistingDoc {
  _id: string;
  _rev: string;
  [key: string]: any;
}

export type Doc = Partial<ExistingDoc>;

export enum CurrentUser {
  isLoggedIn = 'isLoggedIn',
  name = 'username',
  pass = 'password',
  role = 'role',
}

export type DataTableService = RdtService | PcrService | ReturneeService;

export function isReturneeService(service: DataTableService): service is ReturneeService {
  return 'getAllWards' in service;
}
