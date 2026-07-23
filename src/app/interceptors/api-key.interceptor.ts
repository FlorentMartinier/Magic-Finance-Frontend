import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith(environment.apiUrl)) {
        const authReq = req.clone({
            setHeaders: {
                'X-API-KEY': environment.apiKey
            }
        });
        return next(authReq);
    }

    return next(req);

};