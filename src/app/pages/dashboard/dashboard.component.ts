import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { DashboardAnalytics } from '../../models/analytics.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    private analyticsService = inject(AnalyticsService);

    data = signal<DashboardAnalytics | null>(null);
    loading = signal(true);

    ngOnInit() {
        this.analyticsService.getDashboardData().subscribe({
            next: res => {
                this.data.set(res);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}