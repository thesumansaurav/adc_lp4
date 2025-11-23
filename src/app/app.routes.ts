import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { OtpComponent } from './auth/otp/otp.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // 👈 default route
    { path: 'login', component: LoginComponent },
    { path: 'otp', component: OtpComponent },
];

