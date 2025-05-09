export interface CreateEventDto {
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  isRegistrationOpen?: boolean;
  isRegistrationRequired?: boolean;
  isOpenToOutsiders?: boolean;
}
