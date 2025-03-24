import { ScoreComponent } from '@/types/ScoreComponent';

/**
 * Diese Klasse berechnet einen Score basierend auf der Anzahl der Zimmer eines Inserats.
 * Befindet sich die Zimmerzahl innerhalb des von den Preferences vorgegebenen Bereichs, wird der Score erhöht
 */
export class RoomScore implements ScoreComponent {
  async calculateScore(listing: any, preferences: any): Promise<number> {
    const { rooms } = listing;
    // Überprüfe, ob die Zimmerzahl im gewünschten Bereich liegt
    if (rooms >= preferences.minRooms && rooms <= preferences.maxRooms) {
      return 3;
    }
    return 0;
  }
}
