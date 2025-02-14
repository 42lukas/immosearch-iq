import { ScoreComponent } from '@/types/ScoreComponent';

export class RoomScore implements ScoreComponent {
    calculateScore(listing: any, preferences: any): number {
        const { rooms } = listing;
        if (rooms >= preferences.minRooms && rooms <= preferences.maxRooms) {
            return 3;
        }
        return 0;
    }
}
