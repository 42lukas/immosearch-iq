import { ScoreComponent } from '@/types/ScoreComponent';

export class TransportScore implements ScoreComponent {
    async calculateScore(listing: any, preferences: any): Promise<number> {
        const stopsNearby = listing.publicTransportStops || 0;
        if (stopsNearby > 5) {
            return 2;
        } else if (stopsNearby > 2) {
            return 1;
        }
        return 0;
    }
}


// leider nicht mehr Zeitlich geschafft eine wirkliche Logik mit echten ÖPNV Stopps zu implementieren