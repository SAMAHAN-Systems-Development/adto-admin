export type AnnouncementType = "INFO" | "WARNING" | "CANCELLED";

export interface CreateAnnouncementRequest {
  eventId: string; // associated event
  announcementType: AnnouncementType;
  title: string;
  content: string;
}

export interface UpdateAnnouncementRequest {
  announcementType?: AnnouncementType;
  title?: string;
  content?: string;
}

export interface AnnouncementFormRequest {
  announcementType: AnnouncementType;
  title: string;
  content: string;
}

export interface AnnouncementResponse {
  id: string;
  eventId: string;
  announcementType: AnnouncementType;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
