import { useQuery } from "@tanstack/react-query";
import {
  findAllRegistrationsByEvent,
  findOneRegistration,
} from "../services/registrationService";

export const useRegistrationsQuery = (
  eventId: string,
  params?: {
    page?: number;
    limit?: number;
    searchFilter?: string;
    orderBy?: "asc" | "desc";
  }
) => {
  return useQuery({
    queryKey: [
      "registrations",
      eventId,
      params?.page,
      params?.limit,
      params?.searchFilter,
      params?.orderBy,
    ],
    queryFn: () => findAllRegistrationsByEvent(eventId, params),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOneRegistrationQuery = (registrationId: string) => {
  return useQuery({
    queryKey: ["registration", registrationId],
    queryFn: () => findOneRegistration(registrationId),
    enabled: !!registrationId,
    staleTime: 5 * 60 * 1000,
  });
};
