import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="image-uploader"
         [class.dragover]="isDragOver"
         (dragover)="onDragOver($event)"
         (dragleave)="onDragLeave($event)"
         (drop)="onDrop($event)">
      <ng-container *ngIf="existingImageUrl && !selectedFilePreview; else previewBlock">
        <img [src]="existingImageUrl" alt="Existing Image" />
      </ng-container>
      <ng-template #previewBlock>
        <ng-container *ngIf="selectedFilePreview; else emptyBlock">
          <img [src]="selectedFilePreview" alt="Uploaded Image" />
        </ng-container>
        <ng-template #emptyBlock>
          <div class="image-content">
          <mat-icon>image</mat-icon>
          <p class="hint">Drag & drop PNG/JPG image here or click below</p>
          </div>
        </ng-template>
      </ng-template>
      <input type="file" accept="image/png, image/jpeg" hidden #fileInput (change)="onFileSelected($event)" />
      <button mat-raised-button type="button" color="primary" (click)="onButtonClick($event)" style="align-self: center;">
       {{ (existingImageUrl ||  selectedFilePreview) ? 'Update image' : 'Add image'}}
      </button>
    </div>
  `,
  styles: [`
    .image-uploader {
      border: 1px dashed #ccc;
      border-radius: 4px;
      padding: 1rem;
      text-align: center;
      position: relative;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      button {
        max-width: fit-content;
      }
    }
    .image-uploader.dragover {
      border-color: #1976d2;
      background-color: #e3f2fd;
    }
    .image-uploader img {
      max-width: 100%;
      max-height: 200px;
      object-fit: cover;
      margin-bottom: 1rem;
    }
    .image-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap:8px;
    }
    .hint {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1rem;
    }
  `]
})
export class ImageUploaderComponent implements OnDestroy {
  @Input() existingImageUrl?: string;
  @Output() fileChange = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile?: File;
  selectedFilePreview?: string;
  isDragOver = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.handleFile(input.files[0]);
    }
  }
  onButtonClick(event: Event): void {
    event.stopPropagation()
    this.fileInput.nativeElement.click();
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Only PNG or JPG images are allowed.');
      return;
    }
    this.selectedFile = file;
    this.selectedFilePreview = URL.createObjectURL(file);
    this.fileChange.emit(file);
  }
  ngOnDestroy(): void {
    if (this.selectedFilePreview) {
      URL.revokeObjectURL(this.selectedFilePreview);
      this.selectedFilePreview = undefined;
    }
  }
}
