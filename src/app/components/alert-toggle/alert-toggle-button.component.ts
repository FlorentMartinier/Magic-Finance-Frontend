import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { WebPushService } from '../../services/web-push.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-alert-toggle-button',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './alert-toggle-button.component.html',
})
export class AlertToggleButtonComponent implements OnInit {
    @Input({ required: true }) scryfallId!: string;

    private webPushService = inject(WebPushService);
    private translate = inject(TranslateService);

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
            alert(this.translate.instant('ALERT_BUTTON.ERROR'));
        } finally {
            this.isLoading = false;
        }
    }
}