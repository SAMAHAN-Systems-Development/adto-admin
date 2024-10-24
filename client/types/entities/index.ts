export interface OrganizationParent {
  id: string;
  name: string;
  description: string;
  organizationChildren: OrganizationGroup[];
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
  password: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  isActive: boolean;
  isAdmin: boolean;
  events: Event[];
  organizationParents: OrganizationGroup[];
}

export interface Course {
  id: string;
  name: string;
  users: User[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  contactNumber: string;
  validId?: string;
  courseId: string;
  course: Course;
  isAlumni: boolean;
  batch?: number;
  isActive: boolean;
  registrations: Registration[];
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  registrationId: string;
  registration: Registration;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  confirmedAt?: Date;
  isAttended: boolean;
  ticketCategoryId: string;
  ticketCategory: TicketCategory;
  user: User;
  event: Event;
  payment?: Payment;
  formAnswers: FormAnswers[];
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
  dateStart: Date;
  dateEnd: Date;
  isRegistrationOpen: boolean;
  isRegistrationRequired: boolean;
  isOpenToOutsiders: boolean;
  orgId: string;
  org: OrganizationChild;
  registrations: Registration[];
  ticketCategories: TicketCategory[];
  formQuestions: FormQuestions[];
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
