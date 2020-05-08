/**
 * @license
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Create apiConf.ts based on apiConfExample.ts if you reached here after a build error, likely in a freshly cloned repo
import { Conf, appUris } from './apiConf';

export const environment = {
  production: false,
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
