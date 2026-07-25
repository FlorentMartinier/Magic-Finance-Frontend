import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ScryfallCard } from '../models/analytics.model';

interface ScryfallAutocompleteResponse {
    data: string[];
}

@Injectable({ providedIn: 'root' })
export class ScryfallService {
    private http = inject(HttpClient);
    private baseUrl = 'https://api.scryfall.com';

    autocomplete(query: string): Observable<string[]> {
        if (!query.trim() || query.length < 2) return of([]);
        return this.http
            .get<ScryfallAutocompleteResponse>(`${this.baseUrl}/cards/autocomplete?q=${encodeURIComponent(query)}`)
            .pipe(map(res => res.data));
    }

    getCardNamed(name: string): Observable<ScryfallCard> {
        return this.http.get<ScryfallCard>(`${this.baseUrl}/cards/named?exact=${encodeURIComponent(name)}`);
    }

    getCardById(id: string): Observable<ScryfallCard> {
        return this.http.get<ScryfallCard>(`${this.baseUrl}/cards/${id}`);
    }

    getCardPrints(cardName: string): Observable<any[]> {
        const url = `https://api.scryfall.com/cards/search?q=!"${encodeURIComponent(cardName)}"&unique=prints&order=released`;

        return this.http.get<any>(url).pipe(
            map(res => res.data || []),
            catchError(() => of([]))
        );
    }
}