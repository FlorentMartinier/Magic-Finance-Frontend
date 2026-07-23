import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardAnalytics, DashboardAnalytics } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/v1/analytics'; // À remplacer par l'URL prod en environnement

    getDashboardData(): Observable<DashboardAnalytics> {
        return this.http.get<DashboardAnalytics>(`${this.apiUrl}/dashboard`);
    }

    getCardAnalytics(scryfallId: string): Observable<CardAnalytics> {
        return this.http.get<CardAnalytics>(`${this.apiUrl}/cards/${scryfallId}`);
    }
}