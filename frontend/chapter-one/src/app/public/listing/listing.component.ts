/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as PublicBooksActions from '../../store/public-book/public-book.action';
import {  BookFilter, BookListItem } from '../../core/models/book.model';
import { BookService } from '../../core/services/book.service';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroFunnel, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { selectAllPublicBooks, selectPublicBooksLoading, selectPublicBooksPagination } from '../../store/public-book/public-book.selector';
import { ShimmerComponent } from "../../common/app-shimmer.component";

@Component({
  selector: 'listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, FormsModule, MatButtonModule, NgIconComponent, ShimmerComponent],
  providers: [provideIcons({heroMagnifyingGlass, heroFunnel})]
})
export class ListingComponent implements OnInit, OnDestroy {
  isMobile: boolean = window.innerWidth <= 768;
  isSidenavOpened: boolean = window.innerWidth > 768;
  private routeSub: Subscription = new Subscription();
  private bookPriceSub: Subscription = new Subscription();
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private bookService = inject(BookService);
  page: number = 1;
  limit: number = 10;
  query: string = '';
  authorId: number | null = null;
  genreIds: number[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  

  priceRange: { min: number; max: number } | null = null;

  publicBooks$: Observable<BookListItem[]> = this.store.select(selectAllPublicBooks);
  loading$: Observable<boolean> = this.store.select(selectPublicBooksLoading);
  pagination$: Observable<any> = this.store.select(selectPublicBooksPagination);
  
  
  @HostListener('window:resize', [])
  onResize(): void {
    this.isMobile = window.innerWidth <= 768;
    this.isSidenavOpened = window.innerWidth > 768;
  }
  
  get drawerMode(): 'over' | 'push' | 'side' {
    return this.isMobile ? 'over' : 'side';
  }
  
  ngOnInit(): void {
    this.bookPriceSub = this.bookService.fetchPrice().subscribe(prices => {
      this.priceRange = prices;
    });
  
    this.routeSub = this.route.queryParams.subscribe(params => {
       this.query = params['query'] || '';
       this.authorId = params['authorId'] ? Number(params['authorId']) : null;
      this.genreIds = params['genreIds'] ? params['genreIds'].split(',').map(Number) : [];
        this.minPrice = params['minPrice'] ? Number(params['minPrice']) : null;
     this.maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : null;
    this.page = params['page'] ? Number(params['page']) : 1;
    this.limit = params['limit'] ? Number(params['limit']) : 10;
  
      const filters: BookFilter = {
        searchQuery: this.query,
        authorId: this.authorId,
        genreIds: this.genreIds,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      };
  
      this.store.dispatch(PublicBooksActions.updatePublicBookFilters({ filters }));
      this.store.dispatch(PublicBooksActions.loadPublicBooks({ page: this.page, limit: this.limit, filters }));
    });
  }
  
  onFilterChange(newFilters: BookFilter): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...newFilters, page: 1},
      queryParamsHandling: 'merge'
    });
  }
  onSearch(): void {
    this.onFilterChange({
        searchQuery: this.query,
    });
  }
  
  onPageChange(event: any): void {
    const newPage = event.pageIndex + 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage, limit: event.pageSize },
      queryParamsHandling: 'merge'
    });
  }
  
  onBookClick(bookId: number): void {
    this.store.dispatch(PublicBooksActions.loadPublicBookDetails({ id: bookId }));
    this.router.navigate([`/book/${bookId}`]);
  }
  
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.bookPriceSub.unsubscribe();
  }
}
