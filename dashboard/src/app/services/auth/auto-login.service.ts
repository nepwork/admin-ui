import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { EnvironmentService } from '../env/environment.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginService {

  constructor(
    private authService: AuthService,
    private environment: EnvironmentService,
  ) { }

  onFirstSPAVisit() {
    this.authService.login(this.environment.dbPublicUser, this.environment.dbPublicPass).subscribe();
  }
}
