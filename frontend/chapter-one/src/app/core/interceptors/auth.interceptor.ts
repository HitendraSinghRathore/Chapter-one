import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.authService.getToken();
    let sessionId = this.authService.getSessionId();

    if (!token && !sessionId) {
      sessionId = uuidv4();
      this.authService.setSessionId(sessionId);
    }

    let headers = req.headers;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else if (sessionId) {
      headers = headers.set('x-session-id', sessionId);
    }
    const clonedRequest = req.clone({ headers });
    return next.handle(clonedRequest);
  }
}
