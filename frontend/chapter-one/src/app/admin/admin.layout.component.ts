import { Component,inject, OnDestroy, OnInit } from "@angular/core";
import {MatSidenavModule} from '@angular/material/sidenav';
import { Subscription } from "rxjs";
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroBars4, heroArchiveBox, heroBookOpen, heroRectangleStack, heroHashtag, heroUser} from "@ng-icons/heroicons/outline";
import { RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";
import { Store } from "@ngrx/store";
import * as AuthActions from '../store/auth.actions';
@Component({
    selector: 'admin-layout',
    templateUrl: './admin.layout.component.html',
    styleUrls: ['./admin.layout.scss'],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        NgIconComponent,
        RouterOutlet,
        RouterModule,
        RouterLinkActive
    ],
    providers: [provideIcons({ heroBars4,heroArchiveBox,heroBookOpen, heroRectangleStack, heroHashtag, heroUser })]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
    sidebarBackdrop = false;
    drawerOpened = true;
    isMobile = false;
    year = new Date().getFullYear();
    private breakpointObserver = inject(BreakpointObserver);
    private store = inject(Store);
    private breakpointSub!: Subscription;
    ngOnInit(): void {
        this.breakpointSub = this.breakpointObserver
          .observe(['(max-width: 800px)'])
          .subscribe(result => {
            this.isMobile = result.matches;
            this.drawerOpened = !this.isMobile;
          });
      }
    
      ngOnDestroy(): void {
        this.breakpointSub.unsubscribe();
      }
    
      toggleDrawer(): void {
        this.drawerOpened = !this.drawerOpened;
      }
      logout() {
        this.store.dispatch(AuthActions.logout());
      }
}