import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { CartItem } from "../../core/models/cart.model";
import { Observable, Subscription, take } from "rxjs";
import { selectCartItems, selectCartLoading, selectCartTotalCount, selectCartTotalValue } from "../../store/cart/cart.selectors";
import { Store } from "@ngrx/store";
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import * as CartActions from '../../store/cart/cart.actions';
import { MatButtonModule } from "@angular/material/button";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroArrowLongLeft, heroMinus, heroPlus, heroTrash, heroXMark } from "@ng-icons/heroicons/outline";
import { ShimmerComponent } from "../../common/app-shimmer.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { UserProfile } from "../../core/models/user-profile.model";
import { selectUserProfile } from "../../store/auth.selectors";


@Component({
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    imports: [
        MatButtonModule,
         RouterModule, 
         NgIconComponent, 
        MatButtonModule,
        ShimmerComponent,
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule
    ],
    providers: [
        provideIcons({
            heroArrowLongLeft,
            heroTrash,
            heroMinus,
            heroPlus,
            heroXMark
        })
    ],
    standalone: true
})
export class CartComponent implements OnInit, OnDestroy {    
 private store = inject(Store);
 private router = inject(Router);
  private location = inject(Location);
  cartItems$: Observable<CartItem[]> = this.store.select(selectCartItems);
  totalCount$: Observable<number> = this.store.select(selectCartTotalCount);
  totalValue$: Observable<number> = this.store.select(selectCartTotalValue);
  loading$: Observable<boolean> = this.store.select(selectCartLoading);
  userProfile$: Observable<UserProfile | null> = this.store.select(selectUserProfile);
  
  private subs = new Subscription();
  
  ngOnInit(): void {
    this.subs.add(
        this.store.select(selectCartItems).pipe(take(1)).subscribe(items => {
          if (!items || items.length === 0) {
            this.store.dispatch(CartActions.loadCart());
          }
        })
      );
  }
  
  onRemove(item: CartItem): void {
    this.store.dispatch(CartActions.removeCartItem({ id: item.id }));
  }
  
  onCheckout(): void {
    this.router.navigate(['/checkout']);
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  goBack() {
    this.location.back();
  }
  removeCart(itemId: number): void {
    this.store.dispatch(CartActions.removeCartItem({ id: itemId}));
  }
  addCart(item: CartItem): void {

    const newItem = {
        ...item,
        id: item.bookId,
        quantity: item.quantity + 1
    }
    this.store.dispatch(CartActions.addCartItem({ item:newItem }));
  }
  shopMore() {
    this.router.navigate(['/list']);
  }
}