export interface OrganizationParent {
  id: string;
  name: string;
  description: string;
  organizationChildren: OrganizationGroup[];
  orgCount: number;
}

export interface OrganizationGroup {
  organizationParentId: string;
  organizationParent: OrganizationParent;
  organizationChildId: string;
  organizationChild: OrganizationChild;
}

export interface OrganizationChild {
  id: string;
  name: string;
  acronym?: string;
  icon?: string;
  email: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  isActive: boolean;
  isAdmin: boolean;
  userId?: string;
  events: Event[];
  organizationParents: OrganizationGroup[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  contactNumber: string;
  validId?: string;
  courseId: string;
  isAlumni: boolean;
  batch?: number;
  isActive: boolean;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  yearLevel: string;
  course: string;
  cluster: string;
  confirmedAt?: Date;
  isAttended: boolean;
  ticketCategoryId: string;
  ticketCategory: TicketCategory;
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  registrationDeadline: Date;
  eventId: string;
  event: Event;
  registrations: Registration[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
  banner?: string;
  thumbnail?: string;
  dateStart: Date;
  dateEnd: Date;
  isRegistrationOpen: boolean;
  isRegistrationRequired: boolean;
  isOpenToOutsiders: boolean;
  isPublished: boolean;
  isArchived: boolean;
  orgId: string;
  org: OrganizationChild;
  registrations: Registration[];
  ticketCategories: TicketCategory[];
  formQuestions: FormQuestions[];
  totalRegistrants?: number;
}

export interface FormAnswers {
  id: string;
  answer: string;
  formQuestionId: string;
  formQuestion: FormQuestions;
  registrationId: string;
  registration: Registration;
}

export interface FormQuestionChoices {
  id: string;
  choice: string;
  formQuestionId: string;
  formQuestion: FormQuestions;
}

export interface FormQuestions {
  id: string;
  question: string;
  eventId: string;
  event: Event;
  formElementId: string;
  formElement: FormElements;
  formQuestionChoices: FormQuestionChoices[];
  formAnswers: FormAnswers[];
}

export enum FormElements {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  SELECT = "SELECT",
}

export type AnnouncementType = "INFO" | "WARNING" | "CANCELLED";
export interface EventAnnouncement {
  id: string;
  eventId: string;
  announcementType: AnnouncementType;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
