import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { ScryfallCard } from '../models/analytics.model';
import { LanguageService } from './language.service';

interface ScryfallAutocompleteResponse {
    data: string[];
}

@Injectable({ providedIn: 'root' })
export class ScryfallService {
    private http = inject(HttpClient);
    private languageService = inject(LanguageService);
    private baseUrl = 'https://api.scryfall.com';

    /**
     * Helper getter for current language code
     */
    private get currentLang(): string {
        return this.languageService.currentLang();
    }

    autocomplete(query: string): Observable<string[]> {
        if (!query.trim() || query.length < 2) return of([]);

        const lang = this.currentLang;

        // Si on est en anglais, l'endpoint natif autocomplete est le plus rapide
        if (lang === 'en') {
            return this.http
                .get<ScryfallAutocompleteResponse>(`${this.baseUrl}/cards/autocomplete?q=${encodeURIComponent(query)}`)
                .pipe(map(res => res.data));
        }

        // En français, on interroge la recherche par nom/langue pour récupérer les noms FR
        // unique=cards évite les doublons d'éditions
        const searchUrl = `${this.baseUrl}/cards/search?q=${encodeURIComponent(query)}+lang:${lang}&unique=cards`;

        return this.http.get<any>(searchUrl).pipe(
            map(res => {
                if (!res.data) return [];
                // On extrait la propriété printed_name (nom FR) si elle existe, sinon name (nom EN)
                return res.data.map((card: any) => card.printed_name || card.name);
            }),
            catchError(() => {
                // Fallback sur l'autocomplete anglais en cas d'erreur/aucune carte trouvée
                return this.http
                    .get<ScryfallAutocompleteResponse>(`${this.baseUrl}/cards/autocomplete?q=${encodeURIComponent(query)}`)
                    .pipe(map(res => res.data));
            })
        );
    }
    getCardNamed(name: string): Observable<ScryfallCard> {
        // On interroge Scryfall en cherchant par le nom (qu'il soit FR ou EN)
        const url = `${this.baseUrl}/cards/named?fuzzy=${encodeURIComponent(name)}`;

        return this.http.get<ScryfallCard>(url).pipe(
            switchMap((card) => {
                // Si la carte renvoyée est déjà en Anglais (lang === 'en'), c'est parfait !
                if (card.lang === 'en') {
                    return of(card);
                }

                // Si c'est une carte FR, on va chercher sa version EN canonique via son oracle_id
                // pour que l'ID corresponde à ta Base de Données
                const englishUrl = `${this.baseUrl}/cards/search?q=oracle_id:${card.oracle_id}`;
                return this.http.get<any>(englishUrl).pipe(
                    map(res => {
                        const englishCard = res.data?.[0] || card;
                        // Optionnel : On peut garder l'image FR pour l'affichage tout en gardant l'ID EN pour la BDD !
                        return {
                            ...englishCard,
                            translated_image_uri: card.image_uris?.normal
                        };
                    }),
                    catchError(() => of(card))
                );
            })
        );
    }

    /**
     * Get card by ID in the current active language
     */
    getCardById(id: string): Observable<ScryfallCard> {
        const lang = this.currentLang;

        if (lang === 'en') {
            return this.http.get<ScryfallCard>(`${this.baseUrl}/cards/${id}`);
        }

        // Attempt to fetch localized card version
        return this.http.get<ScryfallCard>(`${this.baseUrl}/cards/${id}`).pipe(
            catchError(() => this.http.get<ScryfallCard>(`${this.baseUrl}/cards/${id}`)) // Fallback to EN if missing
        );
    }

    getCardPrints(cardName: string): Observable<any[]> {
        const lang = this.currentLang;
        // Includes lang parameter in search query
        const langQuery = lang !== 'en' ? `+(lang:${lang} or lang:en)` : '';
        const url = `${this.baseUrl}/cards/search?q=!"${encodeURIComponent(cardName)}"${langQuery}&unique=prints&order=released`;

        return this.http.get<any>(url).pipe(
            map(res => res.data || []),
            catchError(() => of([]))
        );
    }
}