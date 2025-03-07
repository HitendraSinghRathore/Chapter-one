/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import * as PublicBooksActions from '../../store/public-book/public-book.action';
import {  BookFilter, BookListItem } from '../../core/models/book.model';
import { BookService } from '../../core/services/book.service';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {  heroFunnel, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { selectAllPublicBooks, selectPublicBooksLoading, selectPublicBooksPagination } from '../../store/public-book/public-book.selector';
import { ShimmerComponent } from "../../common/app-shimmer.component";
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Author } from '../../core/models/author.model';
import { Genre } from '../../core/models/genre.model';
import { selectAllAdminAuthors } from '../../store/admin-author/admin-author.selectors';
import { selectAllAdminGenres } from '../../store/admin-genre/admin-genre.selectors';
import * as AdminAuthorActions from '../../store/admin-author/admin-author.actions';
import * as AdminGenreActions from '../../store/admin-genre/admin-genre.actions';

@Component({
  selector: 'listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, FormsModule, MatButtonModule, NgIconComponent, ShimmerComponent, MatSliderModule, MatCheckboxModule],
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
  selectedAuthorMap:{ [authorId: number]: boolean } = {};
  selectedGenreMap: { [genreId: number]: boolean } = {};
  minPrice: number | null = null;
  maxPrice: number | null = null;
  

  priceRange: { min: number; max: number }  = { min: 0, max: 0 };
  publicBooks$: Observable<BookListItem[]> = this.store.select(selectAllPublicBooks);
  authors$: Observable<Author[]> = this.store.select(selectAllAdminAuthors);
  genres$: Observable<Genre[]> = this.store.select(selectAllAdminGenres);
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
    this.authors$.pipe(take(1)).subscribe(authors => {
      if(!authors ||authors.length === 0) {
        this.store.dispatch(AdminAuthorActions.loadAdminAuthors({ page: 1 }));
      }
    });
    this.genres$.pipe(take(1)).subscribe(genres => {
      if(!genres || genres.length === 0) {
        this.store.dispatch(AdminGenreActions.loadAdminGenres({ page: 1 }));
      }
    });
    this.bookPriceSub = this.bookService.fetchPrice().subscribe(prices => {
      this.priceRange = prices;
      if(this.minPrice === null && this.maxPrice === null) {
        this.minPrice = prices.min;
        this.maxPrice = prices.max;
      }
    });
  
    this.routeSub = this.route.queryParams.subscribe(params => {
       this.query = params['name'] || '';
       if(params['authorId']) {
          this.selectedAuthorMap = {};
          const ids:number[] = params['authorId'].split(',').map(Number);
          ids.forEach(id => this.selectedAuthorMap[id] = true);
       }
       if(params['genreIds']) {
          this.selectedGenreMap = {};
          const ids:number[] = params['genreIds'].split(',').map(Number);
          ids.forEach(id => this.selectedGenreMap[id] = true);
       }
        this.minPrice = params['minPrice'] ? Number(params['minPrice']) : null;
     this.maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : null;
    this.page = params['page'] ? Number(params['page']) : 1;
    this.limit = params['limit'] ? Number(params['limit']) : 10;
  
      const filters: BookFilter = {
        name: this.query,
        authorId: Object.keys(this.selectedAuthorMap)
          .filter(id => this.selectedAuthorMap[+id])
          .map(Number),
        genreIds: Object.keys(this.selectedGenreMap)
        .filter(id => this.selectedGenreMap[+id])
        .map(Number),
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      };
  
      this.store.dispatch(PublicBooksActions.updatePublicBookFilters({ filters }));
      this.store.dispatch(PublicBooksActions.loadPublicBooks({ page: this.page, limit: this.limit, filters }));
    });
  }
  onAuthorChange() {
      const authorId =  Object.keys(this.selectedAuthorMap)
      .filter(id => this.selectedAuthorMap[+id])
      .map(Number);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { authorId: authorId.length ? authorId.join(',') : null, page: 1 },
        queryParamsHandling: 'merge'
      });
  }
  onGenreChange() {
    const genreIds =  Object.keys(this.selectedGenreMap)
    .filter(id => this.selectedGenreMap[+id])
    .map(Number);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { genreIds: genreIds.length ? genreIds.join(',') : null, page: 1 },
      queryParamsHandling: 'merge'
    });
}
  onFilterChange(newFilters: BookFilter): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...newFilters , page: 1},
      queryParamsHandling: 'merge'
    });
  }
  onSearch(): void {
    this.onFilterChange({
      name: this.query,
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
  formatLabel(value: number): string {
    return `$${value.toFixed(2)}`;
  }
  updateSliders(): void {
    this.onFilterChange({
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }
}
