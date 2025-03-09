import { Component, HostListener, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBars4, heroChevronDown, heroHome, heroMagnifyingGlass, heroShoppingBag, heroUser } from '@ng-icons/heroicons/outline';
import {MatMenuModule} from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserProfile } from '../../core/models/user-profile.model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIconComponent,
    MatMenuModule,
    MatSidenavModule
    ] ,
    providers: [provideIcons({heroHome, heroUser, heroShoppingBag, heroMagnifyingGlass, heroBars4, heroChevronDown})]
})
export class HeaderComponent implements OnInit {
  @Input() cartCount: number|null = 0;
  @Input() user: UserProfile|null = null;
  @Output() sidenavToggle = new EventEmitter<void>();
  showSidenav: boolean = false; 
  router = inject(Router);

  searchQuery: string = '';
  isScrolled: number = 0;
  isListRoute =  window.location.href.includes('/list');
  isMobile: boolean = window.innerWidth <= 768; 

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.isMobile = window.innerWidth <= 768;
  }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event:NavigationEnd) => {
      this.isListRoute = event.urlAfterRedirects.includes('/list');
    });
  }
  logout(): void {
    console.log('User logged out');
  }
  login():void {
    this.router.navigate(['/login']);
  }

  scrollToContent(): void {
    const contentElement = document.getElementById('main');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleSidebar(): void {
    this.sidenavToggle.emit();
  }
  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    this.router.navigate(['/list'], { queryParams: { name: this.searchQuery } });
  }
 
  toggleSidenav(): void {
    this.sidenavToggle.emit();
  }
  goToCart() {
    this.router.navigate(['/cart']);
  }
}
