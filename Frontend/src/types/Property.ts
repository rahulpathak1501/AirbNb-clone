export interface Property {
  _id: number;
  id: number;
  title: string;
  location: string;
  pricePerNight: number;
  imageUrl: string;
  rating: number;
  numberOfGuests: number;
  description: string;
  amenities: string[];
}
