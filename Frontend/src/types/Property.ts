export interface Property {
  _id: number;
  id: number;
  title: string;
  location: string;
  pricePerNight: number;
  images: string[];
  rating: number;
  numberOfGuests: number;
  description: string;
  amenities: string[];
}
