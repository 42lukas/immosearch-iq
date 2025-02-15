import { ScoreComponent } from '@/types/ScoreComponent';
import { PriceScore } from './components/PriceScore';
import { RoomScore } from './components/RoomScore';
import { SizeScore } from './components/SizeScore';
import { LocationScore } from './components/LocationScore';
import { TransportScore } from './components/TransportScore';

export class ScoreManager {
    private components: ScoreComponent[];

    constructor() {
        this.components = [
            new PriceScore(),
            new RoomScore(),
            new SizeScore(),
            new LocationScore(),
            new TransportScore()
        ];
    }

    calculateTotalScore(listing: any, preferences: any): number {
        let totalScore = 0;
        for (const component of this.components) {
            totalScore += component.calculateScore(listing, preferences);
        }
        return Math.min(totalScore, 10);
    }
}
