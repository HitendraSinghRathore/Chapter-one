import { Routes } from '@angular/router';
import { PublicGuard } from '../core/guards/public.guard';

const routes:Routes = [
    {
        path: '',
        loadComponent: () => import('./public-layout.component').then(m => m.PublicLayoutComponent),
        canActivate: [PublicGuard],
        canActivateChild: [PublicGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'list',
                loadComponent: () => import('./listing/listing.component').then(m => m.ListingComponent),
            }
        ]

    }
]

export const publicRoutes = routes;