import { Injectable } from '@angular/core';
import { AppConf } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {

  constructor(private appConf: AppConf) { }

  get dbUri(): string { return this.appConf.uri.docDBUri; }

  get authUri(): string { return `${this.dbUri}_sessions`; } // auth/realms/dev/protocol/openid-connect/token

  get dashboardUser(): string { return this.appConf.db.docDBUser; }

  get dashboardPassword(): string { return this.appConf.db.docDBPassword; }
}
