import { HttpInterceptorFn } from '@angular/common/http';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
    // Ajuste le nom du header ('X-API-KEY', 'X-Api-Key', etc.) selon ton Gateway
    if (req.url.startsWith('http://localhost:8080')) {
        const authReq = req.clone({
            setHeaders: {
                'X-API-KEY': 'local_api_key'
            }
        });
        return next(authReq);
    }

    return next(req);

};