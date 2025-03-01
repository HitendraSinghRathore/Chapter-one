import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { ShimmerComponent } from "../../common/app-shimmer.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroPencil, heroTrash } from "@ng-icons/heroicons/outline";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { Pagination } from "../../core/models/pagination.model";
import * as AdminAuthorSelectors from "../../store/admin-author/admin-author.selectors";
import * as AdminAuthorActions from "../../store/admin-author/admin-author.actions";
import { Author } from "../../core/models/author.model";

interface PageEvent {
    "previousPageIndex": number, "pageIndex": number, "pageSize": number, "length": number 
}
@Component({
    selector: 'author',
    templateUrl: './author.component.html',
    standalone: true,
    styleUrls: ['./author.component.scss'],
    imports: [
            CommonModule,
            MatTableModule,
            MatButtonModule,
            ShimmerComponent,
            MatPaginatorModule,
            NgIconComponent
        ],
        providers: [provideIcons({ heroTrash, heroPencil })]
})
export class AuthorComponent implements OnInit, OnDestroy {
     private dialog = inject(MatDialog);
     private store = inject(Store);
     private router = inject(Router);
     authors$: Observable<Author[]> = this.store.select(AdminAuthorSelectors.selectAllAdminAuthors);
     loading$: Observable<boolean> = this.store.select(AdminAuthorSelectors.selectAdminAuthorLoading);
     pagination$: Observable<Pagination> = this.store.select(AdminAuthorSelectors.selectAdminAuthorPagination);
     displayedColumns: string[] = ['image','name', 'dob', 'updatedAt', 'actions'];
     private subscriptions = new Subscription();

     ngOnInit(): void {
             this.store.dispatch(AdminAuthorActions.loadAdminAuthors({ page: 1, limit: 10 }));
        }
         ngOnDestroy(): void {
                this.subscriptions.unsubscribe();
              }
              onCreate(): void {
                this.router.navigate(['/admin/author/create']);
              }
              onEdit(author: Author): void {
                this.router.navigate(['/admin/author/', author.id]);
              }
        
        onPageChage(event:unknown ): void {
            const evetData = event as PageEvent;
            const newPage = evetData.pageIndex + 1;
            this.store.dispatch(AdminAuthorActions.changeAdminAuthorPage({ page: newPage, limit: evetData.pageSize }));
            this.store.dispatch(AdminAuthorActions.loadAdminAuthors({ page: newPage, limit: evetData.pageSize }));
          }

}