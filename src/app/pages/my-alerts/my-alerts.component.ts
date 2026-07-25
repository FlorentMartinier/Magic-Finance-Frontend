import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WebPushService, UserAlert } from '../../services/web-push.service';

@Component({
    selector: 'app-my-alerts',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './my-alerts.component.html'
})
export class MyAlertsComponent implements OnInit {
    private webPushService = inject(WebPushService);

    alerts: UserAlert[] = [];
    isLoading = true;

    async ngOnInit() {
        await this.loadAlerts();
    }

    async loadAlerts() {
        this.isLoading = true;
        try {
            this.alerts = await this.webPushService.getUserAlerts();
        } catch (error) {
            console.error('Erreur lors du chargement des alertes', error);
            this.alerts = [];
        } finally {
            this.isLoading = false;
        }
    }

    async removeAlert(scryfallId: string) {
        try {
            await this.webPushService.unsubscribeFromCard(scryfallId);
            // Retire la carte de la liste locale immédiatement
            this.alerts = this.alerts.filter(a => a.scryfallId !== scryfallId);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'alerte', error);
        }
    }
}