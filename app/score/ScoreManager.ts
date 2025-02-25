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
  
    // ScoreManager wird auch asynchron
    async calculateTotalScore(listing: any, preferences: any): Promise<number> {
      let totalScore = 0;
      // for-of-Schleife + await
      for (const component of this.components) {
        const partialScore = await component.calculateScore(listing, preferences);
        totalScore += partialScore;
      }
      return totalScore;
    }
  }