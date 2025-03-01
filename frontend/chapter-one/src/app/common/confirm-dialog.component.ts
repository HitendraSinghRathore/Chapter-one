import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  mainText: string;
  subText?: string;
  successText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ data.mainText }}</h2>
    <mat-dialog-content *ngIf="data.subText">
      <p>{{ data.subText }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="onCancel()">{{ data.cancelText }}</button>
      <button mat-raised-button color="primary" (click)="onConfirm()" cdkFocusInitial>
        {{ data.successText }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
    
      mat-dialog-content {
        font-size: 1.6rem;
      }
    `
  ],
  imports: [MatDialogModule, MatButtonModule, CommonModule]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
