import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {MatTableModule} from '@angular/material/table';
import { ConfirmDialogComponent } from "../../common/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Genre } from "../../core/models/genre.model";
import { Pagination } from "../../core/models/pagination.model";
import * as AdminGenreSelectors from "../../store/admin-genre/admin-genre.selectors";
import * as AdminGenreActions from "../../store/admin-genre/admin-genre.actions";
import { ShimmerComponent } from "../../common/app-shimmer.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroPencil, heroTrash } from "@ng-icons/heroicons/outline";

interface PageEvent {
    "previousPageIndex": number, "pageIndex": number, "pageSize": number, "length": number 
}
@Component({
    selector: 'genre',
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        ConfirmDialogComponent,
        MatButtonModule,
        ShimmerComponent,
        MatPaginatorModule,
        NgIconComponent
    ],
    providers: [provideIcons({ heroTrash, heroPencil })]
})
export class GenreComponent implements OnInit, OnDestroy {
    private dialog = inject(MatDialog);
    private store = inject(Store);
    private router = inject(Router);

    genres$: Observable<Genre[]> = this.store.select(AdminGenreSelectors.selectAllAdminGenres);
    loading$: Observable<boolean> = this.store.select(AdminGenreSelectors.selectAdminGenreLoading);
    pagination$: Observable<Pagination> = this.store.select(AdminGenreSelectors.selectAdminGenrePagination);
    displayedColumns: string[] = ['name', 'description', 'updatedAt', 'actions'];

    private subscriptions = new Subscription();

    ngOnInit(): void {
        this.store.dispatch(AdminGenreActions.loadAdminGenres({ page: 1, limit: 10 }));
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
      }
      onCreate(): void {
        this.router.navigate(['/admin/genre/create']);
      }
      onEdit(genre: Genre): void {
        this.router.navigate(['/admin/genre/', genre.id]);
      }
    openDialog(genreId: number) {
       const dialogRef =  this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
     
            data: {
                mainText: 'Delete Genre',
                subText: 'Are you sure you want to delete this genre? This action cannot be undone.',
                successText: 'Delete Genre',
                cancelText: 'Cancel'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(AdminGenreActions.deleteAdminGenre({ id: genreId }));
                this.store.dispatch(AdminGenreActions.loadAdminGenres({ page: 1, limit: 10 }));

            }
        });
    }
    
    onPageChage(event:unknown ): void {
        const evetData = event as PageEvent;
        const newPage = evetData.pageIndex + 1;
        this.store.dispatch(AdminGenreActions.changeAdminGenrePage({ page: newPage, limit: evetData.pageSize }));
        this.store.dispatch(AdminGenreActions.loadAdminGenres({ page: newPage, limit: evetData.pageSize }));
      }
}