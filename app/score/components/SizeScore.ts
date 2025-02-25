import { ScoreComponent } from '@/types/ScoreComponent';

export class SizeScore implements ScoreComponent {
    async calculateScore(listing: any, preferences: any): Promise<number> {
        const { size } = listing;
        if (size >= preferences.minSize && size <= preferences.maxSize) {
            return 4; 
        }
        return 0;
    }
}
