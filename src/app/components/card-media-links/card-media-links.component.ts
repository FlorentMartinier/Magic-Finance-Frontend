// card-media-links.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScryfallCard } from '../../models/analytics.model';

@Component({
    selector: 'app-card-media-links',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card-media-links.component.html'
})
export class CardMediaLinksComponent {
    @Input() scryfallData: ScryfallCard | null = null;
    @Input() purchaseUris: any = null;

    get imageUrl(): string {
        if (!this.scryfallData) return '';
        return (
            this.scryfallData.image_uris?.normal ||
            this.scryfallData.card_faces?.[0]?.image_uris?.normal ||
            ''
        );
    }
}