
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CardFinancialMetricsComponent } from '../../components/card-financial-metrics/card-financial-metrics.component';
import { CardMediaLinksComponent } from '../../components/card-media-links/card-media-links.component';
import { CardPriceChartComponent } from '../../components/card-price-chart/card-price-chart.component';
import { CardPrintSelectorComponent } from '../../components/card-print-selector/card-print-selector.component';
import { CardAnalytics, ScryfallCard } from '../../models/analytics.model';
import { AnalyticsService } from '../../services/analytics.service';
import { ScryfallService } from '../../services/scryfall.service';

Chart.register(...registerables);

@Component({
    selector: 'app-card-detail',
    imports: [
        CommonModule,
        CardMediaLinksComponent,
        CardPrintSelectorComponent,
        CardFinancialMetricsComponent,
        CardPriceChartComponent
    ],
    standalone: true,
    templateUrl: './card-detail.component.html'
})
export class CardDetailComponent implements OnInit {

    analytics = signal<CardAnalytics | null>(null);
    scryfallData = signal<ScryfallCard | null>(null);
    prints = signal<CardPrint[]>([]);
    loading = signal<boolean>(true);
    isLoadingPrints = signal<boolean>(false);

    constructor(
        private analyticsService: AnalyticsService,
        private scryfallService: ScryfallService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = params['scryfallId'];
            if (id) {
                this.loadCardData(id);
            }
        });
    }

    private loadCardData(scryfallId: string): void {
        this.loading.set(true);

        // 1. Charger Scryfall
        this.scryfallService.getCardById(scryfallId).subscribe({
            next: (scryData) => {
                this.scryfallData.set(scryData);
                // Une fois qu'on a la carte, on va chercher ses autres éditions
                if (scryData?.name) {
                    this.loadAllPrints(scryData.name);
                }
            }
        });

        // 2. Charger Analytics Backend
        this.analyticsService.getCardAnalytics(scryfallId).subscribe({
            next: (analyticsData) => {
                this.analytics.set(analyticsData);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    private loadAllPrints(cardName: string): void {
        this.isLoadingPrints.set(true);
        this.scryfallService.getCardPrints(cardName).subscribe({
            next: (printsData) => {
                this.prints.set(printsData);
                this.isLoadingPrints.set(false);
            },
            error: () => this.isLoadingPrints.set(false)
        });
    }

    onSelectPrint(selectedId: string): void {
        const currentId = this.scryfallData()?.id;
        if (selectedId && selectedId !== currentId) {
            this.router.navigate(['/cards', selectedId]);
        }
    }

    /**
   * Retourne les classes CSS Tailwind adaptées au signal de recommandation
   */
    getRecommendationBadgeClass(action: string | undefined): string {
        switch (action?.toUpperCase()) {
            case 'BUY':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'SELL':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            case 'HOLD':
            default:
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        }
    }
}

export interface CardPrint {
    id: string;
    set: string;
    set_name: string;
    released_at: string;
    prices: { eur?: string; usd?: string };
    image_uris?: { normal: string; small: string };
    card_faces?: any[];
}