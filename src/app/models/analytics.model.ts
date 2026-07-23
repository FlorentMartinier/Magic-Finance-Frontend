export interface Recommendation {
    action: 'BUY' | 'SELL' | 'HOLD';
    signalStrength: 'STRONG' | 'MEDIUM' | 'WEAK';
    reason: string;
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
}

// Scryfall DTO
export interface ScryfallCard {
    id: string;
    name: string;
    printed_name?: string;
    image_uris?: {
        normal: string;
        large: string;
    };
    card_faces?: Array<{
        image_uris?: {
            normal: string;
            large: string;
        };
    }>;
}