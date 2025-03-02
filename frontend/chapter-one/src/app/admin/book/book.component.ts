import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencil, heroTrash } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Pagination } from '../../core/models/pagination.model';
import * as AdminBookSelectors from '../../store/admin-book/admin-book.selectors';
import * as AdminBookActions from '../../store/admin-book/admin-book.actions';
import { Book, BookListItem } from '../../core/models/book.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog.component';
import { ShimmerComponent } from '../../common/app-shimmer.component';

interface PageEvent {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  length: number;
}

@Component({
  selector: 'admin-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    NgIconComponent,
    MatDialogModule,
    ShimmerComponent
  ],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [provideIcons({ heroPencil, heroTrash })]
})
export class BookComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  books$: Observable<BookListItem[]> = this.store.select(AdminBookSelectors.selectAllAdminBooks);
  loading$: Observable<boolean> = this.store.select(AdminBookSelectors.selectAdminBookLoading);
  pagination$: Observable<Pagination> = this.store.select(AdminBookSelectors.selectAdminBookPagination);
  displayedColumns: string[] = ['image','name', 'author', 'price', 'updatedAt', 'actions'];
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.store.dispatch(AdminBookActions.loadAdminBooks({ page: 1, limit: 10 }));
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCreate(): void {
    this.router.navigate(['/admin/book/create']);
  }

  onEdit(book: Book): void {
    this.router.navigate(['/admin/book', book.id]);
  }

  onDelete(book: Book): void {
   const dialogRef =  this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
 
        data: {
            mainText: 'Delete Book',
            subText: 'Are you sure you want to delete this book? This action cannot be undone.',
            successText: 'Delete Book',
            cancelText: 'Cancel'
        }
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.store.dispatch(AdminBookActions.deleteAdminBook({ id: book.id }));
            this.store.dispatch(AdminBookActions.loadAdminBooks({ page: 1, limit: 10 }));
        }
    });
  }

  onPageChange(event: unknown): void {
    const evetData = event as PageEvent;
    const newPage = evetData.pageIndex + 1;
    this.store.dispatch(AdminBookActions.changeAdminBookPage({ page: newPage, limit: evetData.pageSize }));
    this.store.dispatch(AdminBookActions.loadAdminBooks({ page: newPage, limit: evetData.pageSize }));
  }
}
