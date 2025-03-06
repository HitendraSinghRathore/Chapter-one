import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {  map, Observable, take } from "rxjs";
import { Author } from "../../core/models/author.model";
import { Genre } from "../../core/models/genre.model";
import { Store } from "@ngrx/store";
import { selectAllAdminAuthors } from "../../store/admin-author/admin-author.selectors";
import { selectAllAdminGenres } from "../../store/admin-genre/admin-genre.selectors";
import * as AdminAuthorActions from "../../store/admin-author/admin-author.actions";
import * as AdminGenreActions from "../../store/admin-genre/admin-genre.actions";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroArrowLongRight, heroBookOpen, heroHeart, heroRocketLaunch, heroStar } from "@ng-icons/heroicons/outline";
import { CommonModule } from "@angular/common";
// Import the ng-icon component if needed (uncomment and adjust based on your project setup)


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule,NgIconComponent],
  providers: [provideIcons({heroBookOpen, heroRocketLaunch, heroHeart, heroStar, heroArrowLongRight})],
  styleUrls  : ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  store = inject(Store);
  authors$: Observable<Author[]> = this.store.select(selectAllAdminAuthors).pipe(map(value => {
    return value.slice(0,4);
  }));
  genres$: Observable<Genre[]> = this.store.select(selectAllAdminGenres);

  ngOnInit(): void {
      this.store.select(selectAllAdminAuthors).pipe(take(1)).subscribe(authors => {
          if (!authors || authors.length === 0) {
            this.store.dispatch(AdminAuthorActions.loadAdminAuthors({ page: 1 }));
          }
        });
      this.store.select(selectAllAdminGenres).pipe(take(1)).subscribe(genres => {
          if (!genres || genres.length === 0) {
            this.store.dispatch(AdminGenreActions.loadAdminGenres({ page: 1 }));
          }
        });
  }
  trackByAuthorId(index: number, author: Author): number { 
    return author?.id; 
  }
}
