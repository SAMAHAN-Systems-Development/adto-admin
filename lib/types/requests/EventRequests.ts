export interface CreateEventRequest {
  name: string;
  description: string;
  venue?: string;
  dateStart: string;
  dateEnd: string;
  isRegistrationOpen?: boolean;
  isRegistrationRequired?: boolean;
  isOpenToOutsiders?: boolean;
  isPublished?: boolean;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  venue?: string;
  banner?: string;
  thumbnail?: string;
  dateStart?: string;
  dateEnd?: string;
  isRegistrationOpen?: boolean;
  isRegistrationRequired?: boolean;
  isOpenToOutsiders?: boolean;
  isPublished?: boolean;
  isRsvpEnabled?: boolean;
}
