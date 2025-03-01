import { Injectable } from '@angular/core';
import {  CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, filter, take, switchMap, catchError } from 'rxjs/operators';
import { selectUserProfile } from '../../store/auth.selectors';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return timer(0, 100).pipe(
      switchMap(() => this.store.select(selectUserProfile)),
      filter((profile: UserProfile | null) => profile !== null),
      take(1),
      map((profile: UserProfile) =>
        profile.roles?.includes('admin') 
          ? true
          : this.router.createUrlTree(['/login'])
      ),
      catchError(() => of(this.router.createUrlTree(['/'])))
    );
  }
  canActivateChild():Observable<boolean | UrlTree> {
    return this.canActivate();
  }
}