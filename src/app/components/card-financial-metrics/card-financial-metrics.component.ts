// card-financial-metrics.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card-financial-metrics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card-financial-metrics.component.html'
})
export class CardFinancialMetricsComponent {
    @Input({ required: true }) recommendation!: { action: string; reason: string };
    @Input({ required: true }) currentPrice: number = 0;
    @Input({ required: true }) change24h: number = 0;
    @Input({ required: true }) movingAverage30d: number = 0;
    @Input({ required: true }) volatility: number = 0;
    @Input({ required: true }) allTimeLow: number = 0;
    @Input({ required: true }) allTimeHigh: number = 0;

    getRecommendationBadgeClass(action: string): string {
        switch (action) {
            case 'BUY':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'SELL':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            default:
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        }
    }
}