import { ScoreComponent } from '@/types/ScoreComponent';

export class PriceScore implements ScoreComponent {
    calculateScore(listing: any, preferences: any): number {
        const { price } = listing;
        if (price >= preferences.minPrice && price <= preferences.maxPrice) {
            return 3;
        }
        return 0;
    }
}
