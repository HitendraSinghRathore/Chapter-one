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
            },
            {
                path: 'cart',
                loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
            },
            {
                path: 'book/:id',
                loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent),
            },
            {
                path: 'address',
                loadComponent: () => import('./address/address.component').then(m => m.AddressComponent),
            },
            {
                path: 'address/:id',
                loadComponent: () => import('./address/address.component').then(m => m.AddressComponent),
            },
            {
                path: 'checkout',
                loadComponent: () => import('./order/checkout.component').then(m => m.CheckoutComponent),
            }
            
          
        ]

    }
]

export const publicRoutes = routes;