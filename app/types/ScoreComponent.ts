export interface ScoreComponent {
    calculateScore(listing: any, preferences: any): Promise<number>;
}
