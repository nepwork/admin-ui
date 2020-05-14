import { Injectable } from '@angular/core';
import { AppConf } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {

  constructor(private appConf: AppConf) { }

  get dbUri(): string { return this.appConf.uri.docDBUri; }

  get authUri(): string { return `${this.appConf.uri.docDBUri}_session`; }
  // auth/realms/dev/protocol/openid-connect/token

}
