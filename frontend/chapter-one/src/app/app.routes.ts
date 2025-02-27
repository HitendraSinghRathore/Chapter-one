
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'signup',
        loadComponent: async () => (await import('./auth/signup/signup.component')).SignupComponent,
    }
];
