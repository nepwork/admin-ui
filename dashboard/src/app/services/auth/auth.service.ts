import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CurrentUser } from '../../models/domain.model';
import { BasicAuth, DBAuthResponse } from '../../models/response.model';
import { EnvironmentService } from '../env/environment.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticated_ = false;
  private user_: string;
  private pass_: string;

  constructor(
    private http: HttpClient,
    private environment: EnvironmentService,
    ) { }

  login(username: string, password: string): Observable<BasicAuth.Response> {
    return this.basicAuthRequest(username, password, true);
  }

  basicAuthRequest(username: string, password: string, refreshCredentials: boolean) {
    const base64AuthString = btoa(`${username}:${password}`);
    return this.http.get<BasicAuth.Response>(this.environment.authUri, {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${base64AuthString}`,
        },
      }).pipe(tap(response => {
        if (refreshCredentials) {
          this.refreshCurrentUserCredentials(BasicAuth.isSuccess(response), username, password);
        }
      }));
  }

  private refreshCurrentUserCredentials(isAuthenticated: boolean, user: string, pass: string) {
    if (isAuthenticated) {
      this.setCredentials(user, pass);
    } else {
      this.removeCredentials();
    }
  }

  private setCredentials(username: string, password: string): void {
    this.user_ = username;
    this.pass_ = password;
    this.isAuthenticated_ = true;
    Object.entries({ username, password, isLoggedIn: 'true' })
      .forEach(([key, val]) => localStorage.setItem(key, val));
  }

  logout(): void {
    this.removeCredentials();
  }

  private removeCredentials(): void {
    this.user_ = null;
    this.pass_ = null;
    this.isAuthenticated_ = false;
    Object.values(CurrentUser).forEach(localStorage.removeItem);
  }

  get user(): string {
    if (this.user_) return this.user_;
    return localStorage.getItem(CurrentUser.name);
  }

  get pass(): string {
    if (this.user_) return this.pass_;
    return localStorage.getItem(CurrentUser.pass);
  }

  get isAuthenticated(): boolean {
    if (this.isAuthenticated_) return this.isAuthenticated_;
    return localStorage.getItem(CurrentUser.isLoggedIn) ? true : false ;
  }

  // TODO remove when jwt setup is fixed
  userAuthRequestCookieBased(username: string, password: string) {
    this.http.post<DBAuthResponse>(this.environment.authUri,
      { username,
        password,
      }).subscribe(response => {
        // this.cookieService.create(response);
      });
  }
}
