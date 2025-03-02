import { Routes } from '@angular/router';
import { PublicGuard } from '../core/guards/public.guard';

const routes:Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [PublicGuard],
        canActivateChild: [PublicGuard]

    }
]

export const publicRoutes = routes;