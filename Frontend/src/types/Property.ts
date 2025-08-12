export interface Property {
  _id: string;
  title: string;
  location: string;
  pricePerNight: number;
  images: string[];
  avgRating: number;
  rating: number;
  numberOfGuests: number;
  description: string;
  amenities: string[];
  latitude: number;
  longitude: number;
}
