import { Component, inject, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as GenreActions from '../../../store/admin-genre/admin-genre.actions'; 
import { selectAdminSelectedGenre } from '../../../store/admin-genre/admin-genre.selectors'; 
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Genre } from "../../../core/models/genre.model";

@Component({
    selector: "app-genre-form",
    templateUrl: "./genre-form.component.html",
    styleUrls: ["./genre-form.component.scss"],
    providers: [],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class GenreFormComponent implements OnInit {
    router = inject(Router);
    route = inject(ActivatedRoute);
    formBuilder = inject(FormBuilder);
    store = inject(Store);

    genreForm: FormGroup;
    isEdit = false;
    genreId: number | null = null;

    constructor() {
        this.genreForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.genreId = params.get('id') ? Number(params.get('id')) : null;
            this.isEdit = !!this.genreId;

            if (this.isEdit && this.genreId) {
                this.store.dispatch(GenreActions.loadAdminGenreDetails({ id: this.genreId }));

                this.store.select(selectAdminSelectedGenre).subscribe((genre: Genre | null) => {
                    if (genre) {
                        console.error(genre)
                        this.genreForm.patchValue(genre);
                    }
                });
            }
        });
    }

    onSubmit(): void {
        if (this.genreForm.valid) {
            const genreData = this.genreForm.value;

            if (this.isEdit && this.genreId) {
                this.store.dispatch(GenreActions.updateAdminGenre({ id: this.genreId, genre: genreData }));
            } else {
                this.store.dispatch(GenreActions.createAdminGenre({ genre: genreData }));
            }

        }
    }
}