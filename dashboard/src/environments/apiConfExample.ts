export const appUris = {
  devDashboard: 'http://localhost:4200',
  stagingDashboard: 'https://staginghost/',
  prodDashboard: 'https://remotehost/',
  devDocDB: 'http://127.0.0.1:5984/',
  stagingDocDB: 'http://127.0.0.1:5984/',
  prodDocDB: 'http://127.0.0.1:5984/',
  docDBUser: 'user',
  docDBPassword: 'pass',
};

export interface Conf {
  dashboardUri: string;
  docDBUri: string;
  docDBUser: string;
  docDBPassword: string;
}

