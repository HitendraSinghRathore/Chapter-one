import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shimmer',
  template: `
    <div class="shimmer-container" [ngStyle]="{width: width, height: height, borderRadius: borderRadius}">
      <div class="shimmer-effect"></div>
    </div>
  `,
  styles: [`
    .shimmer-container {
      position: relative;
      overflow: hidden;
      background-color: #f0f0f0; 
    }

    .shimmer-effect {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite linear;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `],
  imports: [CommonModule]
})
export class ShimmerComponent {
  @Input() width: string = '100px';
  @Input() height: string = '20px'; 
  @Input() borderRadius: string = '0'; 
}