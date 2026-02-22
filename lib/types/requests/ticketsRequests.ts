export type CreateEventTicketRequest = {
  name: string;
  description: string;
  thumbnail?: string;
  price: number;
  capacity: number;
  registrationDeadline: string;
};

export interface Tickets {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  price: number;
  capacity: number;
  registrationDeadline: string;
}
