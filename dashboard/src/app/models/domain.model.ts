import { EventEmitter } from '@angular/core';

export interface DBList {
  [dbId: string]: {
    name: string,
    instance?: any,
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
}
