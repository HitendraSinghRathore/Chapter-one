import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import { AuthService } from './core/services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.authService.getToken();
    let sessionId = this.authService.getSessionId();

    if (token) {
      this.store.dispatch(AuthActions.loadProfile());
    } else {
      if (!sessionId) {
        sessionId = uuidv4();
        this.authService.setSessionId(sessionId);
      }
      this.store.dispatch(AuthActions.loadProfile());
    }
  }
}
