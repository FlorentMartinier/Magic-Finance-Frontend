import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserAlert {
    scryfallId: string;
    cardName: string;
    setCode: string;
    currentPrice: number | null;
    imageUri: string | null;
    lastNotifiedAction: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class WebPushService {
    private http = inject(HttpClient);
    private swPush = inject(SwPush);

    private readonly apiUrl = `${environment.apiUrl}/api/v1/subscriptions`;

    /**
     * Vérifie si le Service Worker est actif et si les notifications sont autorisées
     */
    get isPushSupported(): boolean {
        return this.swPush.isEnabled;
    }

    /**
     * Récupère l'abonnement Push actuel du navigateur s'il existe
     */
    async getCurrentEndpoint(): Promise<string | null> {
        if (!this.isPushSupported) return null;
        const sub = await firstValueFrom(this.swPush.subscription);
        return sub ? sub.endpoint : null;
    }

    /**
   * S'abonner aux alertes pour une carte
   */
    async subscribeToCard(scryfallId: string): Promise<void> {
        if (!this.isPushSupported) {
            throw new Error('Les notifications Push ne sont pas supportées.');
        }

        const sub = await this.swPush.requestSubscription({
            serverPublicKey: environment.vapidPublicKey
        });

        const subJson = sub.toJSON();

        const payload = {
            scryfallId: scryfallId,
            endpoint: sub.endpoint,
            keys: {
                p256dh: subJson.keys?.['p256dh'],
                auth: subJson.keys?.['auth']
            }
        };

        await firstValueFrom(this.http.post<void>(this.apiUrl, payload));
    }

    /**
     * Se désabonner des alertes d'une carte
     */
    async unsubscribeFromCard(scryfallId: string): Promise<void> {
        const endpoint = await this.getCurrentEndpoint();
        if (!endpoint) return;

        await firstValueFrom(
            this.http.delete<void>(this.apiUrl, {
                body: { endpoint, scryfallId }
            })
        );
    }

    /**
     * Récupérer la liste des alertes de l'utilisateur
     */
    async getUserAlerts(): Promise<UserAlert[]> {
        const endpoint = await this.getCurrentEndpoint();
        if (!endpoint) return [];

        return firstValueFrom(
            this.http.post<UserAlert[]>(`${this.apiUrl}/my-alerts`, { endpoint })
        );
    }

    /**
     * Vérifie si l'utilisateur est abonné à une carte spécifique
     */
    async isSubscribedToCard(scryfallId: string): Promise<boolean> {
        const alerts = await this.getUserAlerts();
        return alerts.some(alert => alert.scryfallId === scryfallId);
    }
}