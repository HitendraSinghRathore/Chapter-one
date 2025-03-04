import { Component, inject, OnInit } from "@angular/core";
import { HeaderComponent } from "../common/header/header.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroChevronDown, heroShoppingBag } from "@ng-icons/heroicons/outline";
import { Store } from "@ngrx/store";
import { Observable, take } from "rxjs";
import { UserProfile } from "../core/models/user-profile.model";
import { Author } from "../core/models/author.model";
import { Genre } from "../core/models/genre.model";
import { selectAllAdminGenres } from "../store/admin-genre/admin-genre.selectors";
import { selectAllAdminAuthors } from "../store/admin-author/admin-author.selectors";
import { selectUserProfile } from "../store/auth.selectors";
import * as AdminAuthorActions from "../store/admin-author/admin-author.actions";
import * as AdminGenreActions from "../store/admin-genre/admin-genre.actions";

@Component({
    selector: 'public-layout',
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.scss'],
    standalone: true,
    imports: [CommonModule, HeaderComponent, MatSidenavModule, MatButtonModule, RouterModule, NgIconComponent],
    providers: [provideIcons({
        heroShoppingBag,
        heroChevronDown
    })]

})
export class PublicLayoutComponent implements OnInit { 
    store = inject(Store);  
    router = inject(Router);
    userProfile$: Observable<UserProfile | null> = this.store.select(selectUserProfile);
    authors$: Observable<Author[]> = this.store.select(selectAllAdminAuthors);
    genres$: Observable<Genre[]> = this.store.select(selectAllAdminGenres);

    ngOnInit(): void {
        this.store.select(selectAllAdminAuthors).pipe(take(1)).subscribe(authors => {
            if (!authors || authors.length === 0) {
              this.store.dispatch(AdminAuthorActions.loadAdminAuthors({ page: 1, limit: 10 }));
            }
          });
        this.store.select(selectAllAdminGenres).pipe(take(1)).subscribe(genres => {
            if (!genres || genres.length === 0) {
              this.store.dispatch(AdminGenreActions.loadAdminGenres({ page: 1, limit: 10 }));
            }
          });
    }
    user = {
        name: 'John Doe',
        email: 'john.doe@example.com'
      };
    
      cartCount = 3;
    
      editProfile(): void {
        console.log('Edit Profile clicked');
      }
    
      logout(): void {
        console.log('Logout clicked');
      }
      login() {
        this.router.navigate(['/login']);
      }
}