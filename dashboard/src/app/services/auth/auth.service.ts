import { Injectable } from '@angular/core';
import { AuthCookieService } from './auth-cookie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../env/environment.service';
import { DBAuthResponse } from '../../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class DBAuthService {

  constructor(private cookieService: AuthCookieService,
    private http: HttpClient,
    private environment: EnvironmentService) { }

  dashboardAuthRequest() {
    return this.userAuthRequest(this.environment.dashboardUser, this.environment.dashboardPassword);
  }

  // tslint:disable: no-console
  userAuthRequest(username: string, password: string) {
    console.log('user-pass', username, password);
    this.http.post<DBAuthResponse>(this.environment.authUri,
      { username,
        password,
      }).subscribe(response => {
        console.log('DBAuthService -> userAuthRequest -> response', response);
        this.cookieService.create(response);
      });
      // const responseObs = this.http.post(this.environment.authUri,
      //     'client-id=team-service&username=test&password=test&grant_type=password&scope=openid',
      //   {
      //     headers: new HttpHeaders({
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     }),
      //     observe: 'response',
      //   });
  }
}
