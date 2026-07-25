export interface Recommendation {
    action: 'BUY' | 'SELL' | 'HOLD';
    signalStrength: 'STRONG' | 'MEDIUM' | 'WEAK';
    reason: string;
    reasonParams?: string;
}

export interface PricePoint {
    date: string;
    price: number;
}

export interface CardSummary {
    scryfallId: string;
    name: string;
    currentPrice: number;
    priceChangePercentage: number;
    volatility: number;
}

export interface DashboardAnalytics {
    topGainers: CardSummary[];
    topLosers: CardSummary[];
    mostVolatile: CardSummary[];
    marketIndexHistory: PricePoint[];
}

export interface CardAnalytics {
    scryfallId: string;
    currentPrice: number;
    change24h: number;
    change7d: number;
    movingAverage30d: number;
    volatility: number;
    allTimeHigh: number;
    allTimeLow: number;
    recommendation: Recommendation;
    priceHistory: PricePoint[];
    purchaseUris: PurchaseUris;
}

export interface PurchaseUris {
    cardhoarder: string;
    cardmarket: string;
    tcgplayer: string;
}

// Scryfall DTO
export interface ScryfallCard {
    id: string;
    name: string;
    set: string;
    set_name: string;
    lang: string;
    oracle_id: string;
    collector_number?: string;

    image_uris?: {
        small?: string;
        normal?: string;
        large?: string;
        png?: string;
    };

    card_faces?: Array<{
        name: string;
        image_uris?: {
            small?: string;
            normal?: string;
            large?: string;
        };
    }>;

    prices?: {
        eur?: string;
        usd?: string;
        eur_foil?: string;
        usd_foil?: string;
    };

    // Ajoute d'autres champs de Scryfall au besoin
}