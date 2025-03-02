import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Author } from '../../../core/models/author.model';
import * as AuthorActions from '../../../store/admin-author/admin-author.actions';
import { selectAdminSelectedAuthor } from '../../../store/admin-author/admin-author.selectors';
import { ImageUploaderComponent } from '../../../common/app-image-uploader.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'admin-author-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ImageUploaderComponent,
    NgIconComponent
  ],
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.scss'],
  providers: [provideIcons({ heroArrowLeft })]
})
export class AuthorFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  existingImageUrl: string | undefined;

  isEdit = false;
  authorId: number | null = null;

  private routeSub!: Subscription;
  private authorSub!: Subscription;

  authorForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    dob: [null, Validators.required],
    about: ['', [Validators.required, Validators.minLength(10)]],
    imageFile: [null, Validators.required]
  });

  onFileChange(file: File): void {
    this.authorForm.patchValue({ imageFile: file });
  }
  onBack(): void {
    this.router.navigate(['/admin/author']);
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.authorId = idParam ? Number(idParam) : null;
      this.isEdit = !!this.authorId;

      if (this.isEdit && this.authorId) {
        this.store.dispatch(AuthorActions.loadAdminAuthorDetails({ id: this.authorId }));
        this.authorSub = this.store.select(selectAdminSelectedAuthor).subscribe((author: Author | null) => {
          if (author) {
            this.authorForm.patchValue({
              name: author.name,
              dob: new Date(author.dob),
              about: author.about,
              imageFile: author.image
            });
            
            this.existingImageUrl = author.image || undefined;
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.authorSub) {
      this.authorSub.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
        const formValues = { ...this.authorForm.value };
        if (!(formValues.imageFile instanceof File)) {
            delete formValues.imageFile;
          }
      
      if (this.isEdit && this.authorId) {
    
        this.store.dispatch(AuthorActions.updateAdminAuthor({ id: this.authorId, author: formValues }));
      } else {
        this.store.dispatch(AuthorActions.createAdminAuthor({ author: formValues }));
      }
    }
  }
}
