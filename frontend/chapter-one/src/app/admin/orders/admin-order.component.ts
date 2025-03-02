import { Component, inject, OnInit } from "@angular/core";
import { selectAdminOrderLoading, selectAllAdminOrders } from "../../store/admin-order/admin-order.selectors";
import { Store } from "@ngrx/store";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { ShimmerComponent } from "../../common/app-shimmer.component";
import * as AdminOrderActions from "../../store/admin-order/admin-order.actions";

@Component({
    selector: 'admin-order',
    templateUrl: './admin-order.component.html',
    styleUrls: ['./admin-order.component.scss'],
    imports: [
        CommonModule,
        MatTableModule,
        ShimmerComponent,
    ],
    standalone: true,
})
export class AdminOrderComponent implements OnInit {
    private store = inject(Store);
    orders$ = this.store.select(selectAllAdminOrders);
    loading$ = this.store.select(selectAdminOrderLoading);
    displayedColumns: string[] = ['id', 'user', 'address', 'total', 'status', 'createdAt'];

    ngOnInit(): void {
        this.store.dispatch(AdminOrderActions.loadAdminOrders());
      }
    
     
}