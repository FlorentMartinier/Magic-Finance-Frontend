
import { Component, ElementRef, inject, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../../services/analytics.service';
import { ScryfallService } from '../../services/scryfall.service';
import { CardAnalytics, ScryfallCard } from '../../models/analytics.model';

Chart.register(...registerables);

@Component({
    selector: 'app-card-detail',
    standalone: true,
    templateUrl: './card-detail.component.html'
})
export class CardDetailComponent implements OnInit {

    private canvasElement: HTMLCanvasElement | null = null;
    @ViewChild('chartCanvas') set chartCanvas(ref: ElementRef<HTMLCanvasElement> | undefined) {
        if (ref) {
            this.canvasElement = ref.nativeElement;
            // Dès que l'élément HTML existe, on tente de dessiner si les données sont prêtes
            this.tryRenderChart();
        }
    }

    private route = inject(ActivatedRoute);
    private analyticsService = inject(AnalyticsService);
    private scryfallService = inject(ScryfallService);

    analytics = signal<CardAnalytics | null>(null);
    scryfallData = signal<ScryfallCard | null>(null);
    loading = signal(true);
    chart?: Chart;

    ngOnInit() {
        this.route.params.subscribe(params => {
            console.log('Route params:', params);
            const id = params['scryfallId'];
            this.loadCardData(id);
        });
    }

    private tryRenderChart() {
        const data = this.analytics();

        // Si on a à la fois le canvas ET les données d'historique, on dessine
        if (this.canvasElement && data?.priceHistory) {
            this.renderChart(data);
        }
    }

    private loadCardData(scryfallId: string) {
        this.loading.set(true);

        // Charge les métriques Backend + l'image Scryfall en parallèle
        this.scryfallService.getCardById(scryfallId).subscribe(scry => this.scryfallData.set(scry));

        this.analyticsService.getCardAnalytics(scryfallId).subscribe({
            next: data => {
                this.analytics.set(data);
                this.loading.set(false);
                setTimeout(() => this.renderChart(data), 0);
            },
            error: () => this.loading.set(false)
        });
    }

    getCardImageUrl(card: ScryfallCard): string {
        return card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || '';
    }

    getRecommendationBadgeClass(action: string): string {
        switch (action) {
            case 'BUY': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'SELL': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            default: return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        }
    }

    private renderChart(analytics: CardAnalytics) {
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.canvasElement?.getContext('2d');
        if (!ctx) return;

        const labels = analytics.priceHistory.map(item => new Date(item.date).toLocaleDateString('fr-FR'));
        const prices = analytics.priceHistory.map(item => item.price);

        // 2. Instancier le graphique Chart.js
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Prix (€)',
                    data: prices,
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }
}