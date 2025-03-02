import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBars4, heroChevronDown, heroHome, heroMagnifyingGlass, heroShoppingBag, heroUser } from '@ng-icons/heroicons/outline';
import {MatMenuModule} from '@angular/material/menu';
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
    ] ,
    providers: [provideIcons({heroHome, heroUser, heroShoppingBag, heroMagnifyingGlass, heroBars4, heroChevronDown})]
})
export class HeaderComponent {
  @Input() cartCount: number = 0;
  @Output() sidenavToggle = new EventEmitter<void>();

  searchQuery: string = '';
  isScrolled: boolean = false;
  isMobile: boolean = window.innerWidth <= 768; 

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 0;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.isMobile = window.innerWidth <= 768;
  }
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  logout(): void {
    console.log('User logged out');
  }

  scrollToContent(): void {
    const contentElement = document.getElementById('main-content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSearch(): void {
    // Implement your search logic here
    console.log('Searching for:', this.searchQuery);
  }

  toggleSidenav(): void {
    this.sidenavToggle.emit();
  }
}
