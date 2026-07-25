// card-price-chart.component.ts
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

Chart.register(...registerables);

@Component({
    selector: 'app-card-price-chart',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './card-price-chart.component.html'
})
export class CardPriceChartComponent implements OnChanges, OnDestroy {
    private translate = inject(TranslateService);

    @Input() chartData: Array<{ date: string; price: number }> = [];

    private canvasElement: HTMLCanvasElement | null = null;
    private chart?: Chart;

    @ViewChild('chartCanvas') set chartCanvas(ref: ElementRef<HTMLCanvasElement> | undefined) {
        if (ref) {
            this.canvasElement = ref.nativeElement;
            this.renderChart();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['chartData'] && !changes['chartData'].firstChange) {
            this.renderChart();
        }
    }

    private renderChart(): void {
        if (!this.canvasElement || !this.chartData || this.chartData.length === 0) return;

        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.canvasElement.getContext('2d');
        if (!ctx) return;

        const labels = this.chartData.map(item =>
            new Date(item.date).toLocaleDateString('fr-FR')
        );
        const prices = this.chartData.map(item => item.price);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: this.translate.instant('CARD_DETAIL.price'),
                        data: prices,
                        borderColor: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3
                    }
                ]
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

    ngOnDestroy(): void {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}