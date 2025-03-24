import { ScoreComponent } from '@/types/ScoreComponent';

/**
 * Diese Klasse berechnet einen Score basierend auf der Wohnfläche eines Inserats.
 * Ist die Größe innerhalb des in den Preferences angegebenen Bereichs, wird der Score erhöht
 */
export class SizeScore implements ScoreComponent {
  async calculateScore(listing: any, preferences: any): Promise<number> {
    const { size } = listing;
    // Überprüfe, ob die Wohnfläche im gewünschten Bereich liegt
    if (size >= preferences.minSize && size <= preferences.maxSize) {
      return 4;
    }
    return 0;
  }
}
