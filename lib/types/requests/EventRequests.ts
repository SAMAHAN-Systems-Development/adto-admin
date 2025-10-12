export interface CreateEventRequest {
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  isRegistrationOpen?: boolean;
  isRegistrationRequired?: boolean;
  isOpenToOutsiders?: boolean;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  dateStart?: string;
  dateEnd?: string;
  isRegistrationOpen?: boolean;
  isRegistrationRequired?: boolean;
  isOpenToOutsiders?: boolean;
}
