import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLongLeft } from '@ng-icons/heroicons/outline';
import { selectCartItems, selectCartTotalValue, selectCartTotalCount } from '../../store/cart/cart.selectors';
import { selectAllAddresses } from '../../store/address/address.selectors';
import { CartItem } from '../../core/models/cart.model';
import { Address } from '../../core/models/address.model';
import { OrderService } from '../../core/services/order.service';
import { FormsModule } from '@angular/forms';
import * as AddressActions from '../../store/address/address.actions';
import * as CartActions from '../../store/cart/cart.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog.component';
@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatRadioModule,
    MatExpansionModule,
    MatIconModule,
    MatSnackBarModule,
    NgIconComponent,
    FormsModule
  ],
  providers: [provideIcons({ heroArrowLongLeft })]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private location = inject(Location);
  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  cartItems$: Observable<CartItem[]> = this.store.select(selectCartItems);
  totalCount$: Observable<number> = this.store.select(selectCartTotalCount);
  totalValue$: Observable<number> = this.store.select(selectCartTotalValue);

  addresses$: Observable<Address[]> = this.store.select(selectAllAddresses);

  selectedAddressId: number | null = null;
  paymentMode: string = 'cod';
  loader = true;

  cartId: number = 0;

  private subs = new Subscription();

  ngOnInit(): void {
   
    this.subs.add(
      this.addresses$.subscribe(addresses => {
        if (addresses && addresses.length > 0 && !this.selectedAddressId) {
          this.selectedAddressId = addresses[0].id;
          this.loader = false;
        } else {
            this.store.dispatch(AddressActions.loadAddresses());
        }
      })
    );
    
  }

  goBack(): void {
    this.location.back();
  }

  onCheckout(): void {
    if (!this.selectedAddressId) {
      this.snackBar.open('Please select an address.', 'OK', { duration: 3000 });
      return;
    }
    const payload = {
      addressId: this.selectedAddressId,
      cartId: this.cartId,
      paymentMode: this.paymentMode
    };
    this.orderService.checkout(payload).subscribe({
      next: (response) => {
        const orderId = response.orderId;
        this.snackBar.open('Order placed successfully', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
        this.store.dispatch(CartActions.loadCart());
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            mainText: 'Order placed successfully',
            subText: 'Order id: ' + orderId,
            successText: 'Continue Shopping',
            cancelText: 'Home'
          }

        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.router.navigate(['/list'] );
          } else {
            this.router.navigate(['/']);
          }
        });
      },
      error: () => {
        this.snackBar.open('Checkout failed. Please try again.', 'OK', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  addAddress() {
    this.router.navigate(['/address']);
  }
}

