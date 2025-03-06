import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { selectUserProfile } from '../../store/auth.selectors';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectUserProfile).pipe(
      take(1),
      map((profile: UserProfile | null) => {
        if (!profile) return true;
        if (profile.roles.includes('admin')) {
          return this.router.createUrlTree(['/admin']);
        }
        return true;
      }),
      catchError(() => of(true))
    );
  }
  canActivateChild():Observable<boolean | UrlTree> {
    return this.canActivate();
  }
}
