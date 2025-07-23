export interface Booking {
  _id: string;
  userId: string;
  propertyId: {
    _id: string;
    title: string;
    location: string;
    images: string[];
    pricePerNight?: number;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string; // e.g. "confirmed" | "cancelled"
  createdAt?: string;
  updatedAt?: string;
}
