import { ScoreComponent } from '@/types/ScoreComponent';
import { PriceScore } from './components/PriceScore';
import { RoomScore } from './components/RoomScore';
import { SizeScore } from './components/SizeScore';
import { LocationScore } from './components/LocationScore';
import { TransportScore } from './components/TransportScore';

/**
 * Diese Klasse verwaltet alle Score-Komponenten, die unterschiedliche Kriterien
 * (Preis, Zimmer, Größe, Standort) zur Bewertung eines Inserats
 * Mit der Methode calculateTotalScore werden die Teilscores der einzelnen Komponenten aufsummiert
 */
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
  
  /**
   * Diese Methode berechnet den Gesamtscore für ein Inserat.
   */
  async calculateTotalScore(listing: any, preferences: any): Promise<number> {
    let totalScore = 0;

    // Iteriere über alle Score-Komponenten und addiere deren Teilscores
    for (const component of this.components) {
      const partialScore = await component.calculateScore(listing, preferences);
      totalScore += partialScore;
    }
    return totalScore;
  }
}
