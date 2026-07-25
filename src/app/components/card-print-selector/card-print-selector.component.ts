// card-print-selector.component.ts
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertToggleButtonComponent } from '../alert-toggle/alert-toggle-button.component';
import { ScryfallCard } from '../../models/analytics.model';

export interface CardPrint {
    id: string;
    set: string;
    set_name: string;
    released_at: string;
    prices: { eur?: string; usd?: string };
    image_uris?: { normal: string; small: string };
    card_faces?: any[];
}

@Component({
    selector: 'app-card-print-selector',
    standalone: true,
    imports: [CommonModule, AlertToggleButtonComponent],
    templateUrl: './card-print-selector.component.html'
})
export class CardPrintSelectorComponent {
    @Input() cardData: ScryfallCard | null = null;
    @Input() prints: CardPrint[] = [];
    @Input() isLoadingPrints: boolean = false;

    @Output() onSelectPrint = new EventEmitter<string>();

    isOpen = signal<boolean>(false);

    toggleDropdown(): void {
        if (!this.isLoadingPrints) {
            this.isOpen.update(v => !v);
        }
    }

    onOptionClick(printId: string): void {
        this.isOpen.set(false);
        if (printId !== this.cardData?.id) {
            this.onSelectPrint.emit(printId);
        }
    }
}