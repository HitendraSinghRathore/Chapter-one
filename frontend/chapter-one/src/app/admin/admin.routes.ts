import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: async () => (await import('./admin.layout.component')).AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'order', pathMatch: 'full' },
      {
        path: 'order',
        loadComponent: async () => (await import('./orders/admin-order.component')).AdminOrderComponent,
      },
      {
        path: 'author',
        loadComponent: async () => (await import('./author/author.component')).AuthorComponent,
      },
      {
        path: 'author/create',
        loadComponent: async () => (await import('./author//create/author-form.component')).AuthorFormComponent,
      },
      {
        path: 'author/:id',
        loadComponent: async () => (await import('./author/create/author-form.component')).AuthorFormComponent,
      },
       {
        path: 'genre',
        loadComponent: async () => (await import('./genres/genre.component')).GenreComponent,
      },
      {
        path: 'genre/create',
        loadComponent: async () => (await import('./genres/create/genre-form.component')).GenreFormComponent,
      },
      {
          path: 'genre/:id',
          loadComponent: async () => (await import('./genres/create/genre-form.component')).GenreFormComponent,
      },
      {
        path: 'book',
        loadComponent: async () => (await import('./book/book.component')).BookComponent,
      },
      {
        path: 'book/create',
        loadComponent: async () => (await import('./book/create/book-form.component')).BookFormComponent,
      },
      {
        path: 'book/:id',
        loadComponent: async () => (await import('./book/create/book-form.component')).BookFormComponent,
      },
    ],
  },
];
