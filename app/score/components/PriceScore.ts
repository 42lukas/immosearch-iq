import { ScoreComponent } from '@/types/ScoreComponent';

export class PriceScore implements ScoreComponent {
    async calculateScore(listing: any, preferences: any): Promise<number> {
        const { price } = listing;
        if (price >= preferences.minPrice && price <= preferences.maxPrice) {
            return 3;
        }
        return 0;
    }
}
