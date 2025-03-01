
import { Routes } from '@angular/router';
import { adminRoutes } from './admin/admin.routes'
import { AdminGuard } from './core/guards/admin.guard';
export const routes: Routes = [
    {
        path: 'signup',
        loadComponent: async () => (await import('./auth/signup/signup.component')).SignupComponent,
    },
    {
        path: 'login',
        loadComponent: async () => (await import('./auth/login/login.component')).LoginComponent,
    },
    {
        path: 'admin',
        children: adminRoutes,
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
    }
];
