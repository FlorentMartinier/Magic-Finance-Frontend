import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScryfallService } from '../../services/scryfall.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    private scryfallService = inject(ScryfallService);
    private router = inject(Router);

    searchQuery = '';
    suggestions = signal<string[]>([]);

    onSearchInput() {
        this.scryfallService.autocomplete(this.searchQuery).subscribe(results => {
            this.suggestions.set(results);
        });
    }

    selectCard(cardName: string) {
        this.suggestions.set([]);
        this.searchQuery = cardName;

        // Récupère la carte canonique (Anglaise) via le nom FR ou EN tapé
        this.scryfallService.getCardNamed(cardName).subscribe({
            next: (card) => {
                this.searchQuery = '';
                // card.id sera TOUJOURS l'ID anglais compatible avec ta BDD !
                this.router.navigate(['/cards', card.id]);
            },
            error: (err) => {
                console.error('Carte non trouvée sur Scryfall', err);
            }
        });
    }
}