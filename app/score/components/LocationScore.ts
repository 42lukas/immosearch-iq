import { ScoreComponent } from '@/types/ScoreComponent';

export class LocationScore implements ScoreComponent {
    calculateScore(listing: any, preferences: any): number {
        if (listing.address.includes(preferences.city)) {
            return 2; // Bonus, wenn Stadtname enthalten
        }
        return 0;
    }
}
