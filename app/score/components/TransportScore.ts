import { ScoreComponent } from '@/types/ScoreComponent';

export class TransportScore implements ScoreComponent {
    calculateScore(listing: any, preferences: any): number {
        const stopsNearby = listing.publicTransportStops || 0;
        if (stopsNearby > 5) {
            return 2; // Bonus für gute ÖPNV-Anbindung
        } else if (stopsNearby > 2) {
            return 1;
        }
        return 0;
    }
}
