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

        // Récupère l'ID Scryfall via le nom exact
        this.scryfallService.getCardNamed(cardName).subscribe(card => {
            this.searchQuery = '';
            this.router.navigate(['/cards', card.id]);
        });
    }
}