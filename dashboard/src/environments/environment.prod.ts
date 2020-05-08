/**
 * @license
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// Create apiConf.ts based on apiConfExample.ts if you reached here after a build error, likely in a freshly cloned repo
import { appUris, Conf } from './apiConf';

export const environment = {
  production: true,
};

export class AppConf {
  public conf: Conf;
  constructor() {
    this.conf.dashboardUri = appUris.prodDashboard;
    this.conf.docDBUri = appUris.prodDocDB;
    this.conf.docDBUser = appUris.docDBUser;
    this.conf.docDBPassword = appUris.docDBPassword;
  }
}
