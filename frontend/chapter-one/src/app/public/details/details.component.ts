import { Component, inject, OnInit } from "@angular/core";
import {  MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroArrowLongLeft } from "@ng-icons/heroicons/outline";
import * as PublicBooksActions from '../../store/public-book/public-book.action';

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Book } from "../../core/models/book.model";
import { selectPublicBooksLoading, selectPublicSelectedBook } from "../../store/public-book/public-book.selector";
import { ShimmerComponent } from "../../common/app-shimmer.component";
import { CommonModule } from "@angular/common";
import * as CartActions from '../../store/cart/cart.actions';
@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    imports: [
        NgIconComponent,
        MatButtonModule,
        RouterModule,
        ShimmerComponent,
        CommonModule
    ],
    providers: [provideIcons({heroArrowLongLeft})],
    standalone: true
})
export class DetailsComponent implements OnInit {
    router = inject(Router);
    route = inject(ActivatedRoute);
    store = inject(Store);

    selectedBook$: Observable<Book | null> = this.store.select(selectPublicSelectedBook);
    loading$: Observable<boolean> = this.store.select(selectPublicBooksLoading);


    ngOnInit(): void {
        const bookId = Number(this.route.snapshot.paramMap.get('id'));
        this.store.dispatch(PublicBooksActions.loadPublicBookDetails({ id: bookId }));
    }
    addToCart(book: Book): void {
        const item = {
            id: book.id,
            name: book.name,
            price: book.price,
            quantity: 1,
            totalCost: book.price
        };
        
        this.store.dispatch(CartActions.addCartItem({ item }));
        
      }
      buyNow(book:Book): void {
        const item = {
            id: book.id,
            name: book.name,
            price: book.price,
            quantity: 1,
            totalCost: book.price
        };
        this.store.dispatch(CartActions.addCartItem({item}));
        this.router.navigate(['/checkout']);
      }

}