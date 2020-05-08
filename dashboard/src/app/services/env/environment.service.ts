import { Injectable } from '@angular/core';
import { AppConf } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {

  constructor(private appConf: AppConf) { }

  get dbUri(): string { return this.appConf.conf.docDBUri; }
}
