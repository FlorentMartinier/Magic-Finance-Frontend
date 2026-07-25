import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { WebPushService } from '../../services/web-push.service';


@Component({
    selector: 'app-alert-toggle-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert-toggle-button.component.html',
})
export class AlertToggleButtonComponent implements OnInit {
    @Input({ required: true }) scryfallId!: string;

    private webPushService = inject(WebPushService);

    isSubscribed = false;
    isLoading = false;

    async ngOnInit() {
        this.checkSubscriptionStatus();
    }

    async checkSubscriptionStatus() {
        try {
            this.isSubscribed = await this.webPushService.isSubscribedToCard(this.scryfallId);
        } catch (e) {
            this.isSubscribed = false;
        }
    }

    async toggleAlert() {
        this.isLoading = true;
        try {
            if (this.isSubscribed) {
                await this.webPushService.unsubscribeFromCard(this.scryfallId);
                this.isSubscribed = false;
            } else {
                await this.webPushService.subscribeToCard(this.scryfallId);
                this.isSubscribed = true;
            }
        } catch (error) {
            console.error('Erreur lors du changement d\'abonnement', error);
            alert('Impossible de modifier les alertes. Vérifiez que les notifications sont autorisées.');
        } finally {
            this.isLoading = false;
        }
    }
}