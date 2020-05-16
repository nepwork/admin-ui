import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAlertModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [ LoginComponent ],
  imports: [
    CommonModule,
    NbAlertModule,
    NbIconModule,
    NbInputModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LoginModule { }
