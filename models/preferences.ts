export interface UserPreferences {
    city: string;
    minPrice: number;
    maxPrice: number;
    minRooms: number;
    maxRooms: number;
    minSize: number;
    maxSize: number;
  }
  
  export interface ApartmentListing {
    title: string;
    price: number;
    size: number;
    rooms: number;
    location: string;
    url: string;
    score: number;
  }