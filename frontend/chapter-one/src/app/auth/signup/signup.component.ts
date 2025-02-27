import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEye, heroEyeSlash } from '@ng-icons/heroicons/outline';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
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
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  formLoading = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  signupForm: FormGroup = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    mobile: [null, [Validators.required, Validators.minLength(10)]],
    password: [null, Validators.required], 
    confirmPassword: [null, Validators.required]
  },
  {
    validators: [this.passwordsMatchValidator,this.passwordRegexValidator]
  });

  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get mobile() { return this.signupForm.get('mobile'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPassword(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  private passwordsMatchValidator(control: AbstractControl): null | { mismatch: true } {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword && password
      ? null
      : { mismatch: true };
  }
  private passwordRegexValidator(control: AbstractControl): null | { regex: true } {
    const password = control.get('password')?.value;
    const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$');   
     return password && password.match(passwordRegex)
      ? null
      : { regex: true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { firstName, lastName, email, mobile, password } = this.signupForm.value;
      this.formLoading = true;
      this.authService.signup(firstName, lastName, email, password, mobile )
        .subscribe({
          next: (response) => {
            this.formLoading = false;
            this.snackBar.open(response?.message || 'Signup successful', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.formLoading = false;
            this.snackBar.open(err?.error?.message || 'Signup failed, please try again.', 'Close', {
                duration: 3000,
                 horizontalPosition: 'center',
                 verticalPosition: 'top'
              });
          }
        });
    }
  }
}
