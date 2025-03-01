import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { heroEye, heroEyeSlash } from "@ng-icons/heroicons/outline";
import { Store } from "@ngrx/store";
import * as AuthActions from '../../store/auth.actions';
import { Actions, ofType } from "@ngrx/effects";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatLabel,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        NgIconComponent,
        MatSnackBarModule
      ],
      providers: [
        provideIcons({ heroEye, heroEyeSlash })
      ]
})
export class LoginComponent implements OnInit, OnDestroy {
    private fb = inject(FormBuilder);
    store = inject(Store);
    private actions$ = inject(Actions);
    private destroy$ = new Subject<void>();
    formLoading = false;
    passwordVisible = false;
    loginForm = this.fb.group({
        loginValue: ['', Validators.required],
        password: ['', Validators.required], 
    });
    ngOnInit(): void {
        this.actions$
          .pipe(
            ofType(AuthActions.loginSuccess, AuthActions.loginFailure),
            takeUntil(this.destroy$)
          )
          .subscribe(() => {
            this.formLoading = false;
          });
      }
    get loginValue() { return this.loginForm.get('loginValue'); }
    get password() { return this.loginForm.get('password'); }

    togglePassword(): void {
        this.passwordVisible = !this.passwordVisible;
    }
    onSubmit(): void {
        const { loginValue, password } = this.loginForm.value;
        this.formLoading = true;
        this.store.dispatch(AuthActions.login({ loginValue: loginValue!.trim(), password: password! }));
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}