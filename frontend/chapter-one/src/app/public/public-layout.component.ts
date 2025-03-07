import { Component, inject, OnInit } from "@angular/core";
import { HeaderComponent } from "../common/header/header.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroChevronDown, heroMagnifyingGlass, heroShoppingBag } from "@ng-icons/heroicons/outline";
import { Store } from "@ngrx/store";
import { filter, Observable } from "rxjs";
import { UserProfile } from "../core/models/user-profile.model";
import { selectUserProfile } from "../store/auth.selectors";
import { FooterComponent } from "../common/footer/footer.component";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";


@Component({
    selector: 'public-layout',
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.scss'],
    standalone: true,
    imports: [CommonModule, HeaderComponent, MatSidenavModule, MatButtonModule, RouterModule, NgIconComponent, FooterComponent, MatInputModule, MatFormField, FormsModule],
    providers: [provideIcons({
        heroShoppingBag,
        heroChevronDown,
        heroMagnifyingGlass
    })]

})
export class PublicLayoutComponent implements OnInit { 
    store = inject(Store);  
    router = inject(Router);
    userProfile$: Observable<UserProfile | null> = this.store.select(selectUserProfile);
    searchQuery: string = '';
    isListRoute = window.location.href.includes('/list');

    
      cartCount = 3;
    ngOnInit(): void {
       this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event:NavigationEnd) => {
        this.isListRoute = event.urlAfterRedirects.includes('/list');
      });
    }
      editProfile(): void {
        console.log('Edit Profile clicked');
      }
    
      logout(): void {
        console.log('Logout clicked');
      }
      login() {
        this.router.navigate(['/login']);
      }
      onSearch(): void {
        console.log('Searching for:', this.searchQuery);
        this.router.navigate(['/list'], { queryParams: { name: this.searchQuery } });
      }
}