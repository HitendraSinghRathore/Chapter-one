
import { Routes } from '@angular/router';
import { adminRoutes } from './admin/admin.routes'
import { AdminGuard } from './core/guards/admin.guard';
import { publicRoutes } from './public/public.routes';
export const routes: Routes = [
    {
        path: 'signup',
        loadComponent: async () => (await import('./auth/signup/signup.component')).SignupComponent,
    },
    {
        path: 'login',
        loadComponent: async () => (await import('./auth/login/login.component')).LoginComponent,
    },
    ...publicRoutes,
    {
        path: 'admin',
        children: adminRoutes,
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
    },
    {
        path: '**',
        loadComponent: async () => (await import('./error/error.component')).ErrorComponent
       
    }
];
