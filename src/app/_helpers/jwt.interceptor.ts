import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available        
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let token = localStorage.getItem('token');
        console.log(token);        
        //if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    //Authorization: `Bearer ${currentUser.token}`
                    //Authorization: "Bearer " + currentUser
                    //Authorization: `Bearer ${token}`
                    Authorization: `${token}`
                }
            });
        //}

        return next.handle(request);
    }
}