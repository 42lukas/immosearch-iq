import { ScoreComponent } from '@/types/ScoreComponent';

/**
 * Diese Klasse berechnet einen Score für ein Inserat basierend auf dem Preis.
 * Liegt der Preis innerhalb des durch die Preferences vorgegebenen Bereichs, wird der Score erhöht
 */
export class PriceScore implements ScoreComponent {
  async calculateScore(listing: any, preferences: any): Promise<number> {
    const { price } = listing;
    // Überprüfe, ob der Preis im erlaubten Bereich liegt
    if (price >= preferences.minPrice && price <= preferences.maxPrice) {
      return 3;
    }
    return 0;
  }
}
