import { Component, inject } from "@angular/core";
import { HeaderComponent } from "../common/header/header.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroChevronDown, heroShoppingBag } from "@ng-icons/heroicons/outline";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { UserProfile } from "../core/models/user-profile.model";
import { selectUserProfile } from "../store/auth.selectors";
import { FooterComponent } from "../common/footer/footer.component";


@Component({
    selector: 'public-layout',
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.scss'],
    standalone: true,
    imports: [CommonModule, HeaderComponent, MatSidenavModule, MatButtonModule, RouterModule, NgIconComponent, FooterComponent],
    providers: [provideIcons({
        heroShoppingBag,
        heroChevronDown
    })]

})
export class PublicLayoutComponent  { 
    store = inject(Store);  
    router = inject(Router);
    userProfile$: Observable<UserProfile | null> = this.store.select(selectUserProfile);
   
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