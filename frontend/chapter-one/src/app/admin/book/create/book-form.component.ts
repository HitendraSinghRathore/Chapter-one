import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectAdminSelectedBook } from "../../../store/admin-book/admin-book.selectors";
import { Book } from "../../../core/models/book.model";
import * as BookActions from "../../../store/admin-book/admin-book.actions";
import { Subscription } from "rxjs";
import {  MatInput } from "@angular/material/input";
import { ImageUploaderComponent } from "../../../common/app-image-uploader.component";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import {  MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { AuthorService } from "../../../core/services/author.service";
import { GenreService } from "../../../core/services/genre.service";
import { Author } from "../../../core/models/author.model";
import { Genre } from "../../../core/models/genre.model";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroArrowLeft } from "@ng-icons/heroicons/outline";

@Component({
    selector: 'admin-book-form',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.scss']   ,
    standalone: true,
    imports: [MatInput, MatButtonModule, ImageUploaderComponent, ReactiveFormsModule, CommonModule,MatFormFieldModule,MatDatepickerModule, MatNativeDateModule,MatSelectModule, NgIconComponent],
    providers: [provideIcons({ heroArrowLeft })]
})
export class BookFormComponent implements OnInit, OnDestroy {   
   store = inject(Store);
   route = inject(ActivatedRoute);
   router = inject(Router);
   formBuilder = inject(FormBuilder);
   existingBookImageUrl: string | undefined;
   private authorService = inject(AuthorService);
  private genreService = inject(GenreService);

  authors: Author[] = [];
  genres: Genre[] = [];

   bookForm: FormGroup;
  isEdit = false;
  bookId: number | null = null;
  routeSub = new Subscription();
  constructor() {
    this.bookForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ISBN: ['', [Validators.required]],
      pageCount: ['', [Validators.required, Validators.min(1)]],
      sellableQuantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      countryOfOrigin: ['', [Validators.required, Validators.minLength(3)]],
      publishedDate: ['', Validators.required],
      edition: ['', [Validators.required]],
      genres: [[], Validators.required],
      authorId: [null, Validators.required],
      imageFile: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.routeSub.add(this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id') ? Number(params.get('id')) : null;
      this.isEdit = !!this.bookId;

      if (this.isEdit && this.bookId) {
        this.store.dispatch(BookActions.loadAdminBookDetails({ id: this.bookId }));

        this.store.select(selectAdminSelectedBook).subscribe((book: Book | null) => {
          if (book) {
            this.bookForm.patchValue({
                ...book,
                genres: book.genres.map(g => g.id),
                imageFile: book.image
            });
            if (book.image) {
              this.existingBookImageUrl = book.image;
            }
          }
        });
      }
    })
    );
    this.routeSub.add(
        this.authorService.fetchAllAuthors().subscribe(response => {
          this.authors = response.data; 
        })
      );
      
      this.routeSub.add(
        this.genreService.fetchAllGenres().subscribe(response => {
          this.genres = response.data; 
        })
      );
  }
  onBack(): void {
    this.router.navigate(['/admin/book']);
  }
  onFileChange(file: File): void {
    this.bookForm.patchValue({ imageFile: file });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
        const formValues = { ...this.bookForm.value };
        if (!(formValues.imageFile instanceof File)) {
          delete formValues.imageFile;
        }
        const formData = new FormData();
        formData.append('name', formValues.name);
        formData.append('description', formValues.description);
        formData.append('ISBN', formValues.ISBN);
        formData.append('pageCount', formValues.pageCount.toString());
        formData.append('sellableQuantity', formValues.sellableQuantity.toString());
        formData.append('price', formValues.price.toString());
        formData.append('countryOfOrigin', formValues.countryOfOrigin);
        formData.append('publishedDate', formValues.publishedDate ? new Date(formValues.publishedDate).toISOString() : '');
        formData.append('edition', formValues.edition);
        formData.append('authorId', formValues.authorId.toString());
        if (formValues.genres && formValues.genres.length) {
          formData.append('genres', JSON.stringify(formValues.genres));
        }
        if (formValues.imageFile) {
          formData.append('image', formValues.imageFile);
        }
      if (this.isEdit && this.bookId) {
        this.store.dispatch(BookActions.updateAdminBook({ id: this.bookId, book: formData }));
      } else {
        this.store.dispatch(BookActions.createAdminBook({ book: formData }));
      }
    }
  } 
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}