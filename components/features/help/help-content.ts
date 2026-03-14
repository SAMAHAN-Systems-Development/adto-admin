import { UserType } from "@/lib/types/user-type";

export interface HelpGuide {
  id: string;
  title: string;
  shortDescription: string;
  whatItDoes: string;
  steps: string[];
  notes: string[];
  allowedRoles?: UserType[];
}

export interface HelpFaq {
  id: string;
  question: string;
  answer: string;
  allowedRoles?: UserType[];
}

export interface GettingStartedItem {
  id: string;
  title: string;
  description: string;
  steps: string[];
  allowedRoles?: UserType[];
}

export const gettingStartedItems: GettingStartedItem[] = [
  {
    id: "navigate-sidebar",
    title: "Use the sidebar to move around",
    description:
      "Open modules from the left sidebar. On mobile, use the menu button in the header to open it.",
    steps: [
      "Open the sidebar and choose Dashboard for an overview.",
      "Go to My Events to create or manage events.",
      "Use search, tabs, and filters in each page to find records quickly.",
    ],
  },
  {
    id: "understand-role-view",
    title: "Understand role-based access",
    description:
      "The interface changes based on your role. You only see pages and actions available to your account.",
    steps: [
      "If you are Superadmin (ADMIN), you can manage organizations and ticket requests.",
      "If you are Admin / Organization (ORGANIZATION), you can manage your organization profile and events.",
      "If a page is missing, your role does not currently have access to that feature.",
    ],
  },
];

export const helpGuides: HelpGuide[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    shortDescription: "Track key metrics and get to common actions quickly.",
    whatItDoes:
      "Dashboard is your starting point. It shows summary cards, calendar insights, and quick actions relevant to your role.",
    steps: [
      "Open Dashboard from the sidebar.",
      "Review overview cards to check totals and event status counts.",
      "Use Quick Actions to jump directly to common tasks.",
      "Use calendar and activity sections to monitor current operations.",
    ],
    notes: [
      "Superadmin (ADMIN) sees platform-wide metrics.",
      "Admin / Organization (ORGANIZATION) sees organization-scoped metrics.",
    ],
  },
  {
    id: "events",
    title: "Event Management",
    shortDescription: "Create, edit, review, and archive events.",
    whatItDoes:
      "My Events lets you manage your event lifecycle from draft to archived. You can search events and filter by status tabs. Paid tickets require Superadmin approval before they can be sold, and approved requests include a ticket link that redirects users to the Helixpay store for ticket purchase.",
    steps: [
      "Navigate to My Events from the sidebar.",
      "Click Add Event to open the creation flow.",
      "Complete required fields, then save and publish when ready.",
      "Use status tabs (Upcoming, Drafts, Finished, Archived) to find events.",
      "Open an event row to review details or edit/archive it when needed.",
    ],
    notes: [
      "Event start date must be in the future and end date must be after start date.",
      "Archiving is blocked when an event already has registered participants.",
      "Organization users operate on their own organization scope.",
      "Paid ticket requests are approved only when ticket information is complete and a ticket thumbnail is provided.",
      "Requests can be declined when information is insufficient or when no ticket thumbnail is attached.",
    ],
  },
  {
    id: "ticket-requests",
    title: "Ticket Request Moderation",
    shortDescription: "Review and resolve ticket link requests from organizations.",
    whatItDoes:
      "Ticket Requests is used by Superadmin to process organization requests by status and decide approval outcomes.",
    steps: [
      "Open Requests from the sidebar.",
      "Use status tabs to focus on Pending, Approved, or Declined items.",
      "Open a request row to view full details.",
      "Approve with a valid ticket link, decline with a reason, or revert when re-review is needed.",
    ],
    notes: [
      "Only Superadmin (ADMIN) can approve, decline, or revert requests.",
      "Organizations can submit and cancel only pending requests from their own scope.",
    ],
    allowedRoles: [UserType.ADMIN],
  },
  {
    id: "organizations",
    title: "Organization Management",
    shortDescription: "Create and maintain organization records and parent groups.",
    whatItDoes:
      "Organizations lets Superadmin manage organization profiles, parent organization categories, and archival status.",
    steps: [
      "Open Organizations from the sidebar.",
      "Use the Organizations table to search, view, or archive organization records.",
      "Open an organization to review details and apply updates.",
      "Switch to Parent Organizations tab to create, edit, or remove parent groups.",
    ],
    notes: [
      "Deleting a parent organization with child organizations is not allowed.",
      "Organization creation provisions an organization account used for login.",
    ],
    allowedRoles: [UserType.ADMIN],
  },
  {
    id: "account",
    title: "Account Management",
    shortDescription: "Maintain your organization profile and credentials.",
    whatItDoes:
      "Account page allows organization users to update profile information, social links, and optionally password.",
    steps: [
      "Open Account from the sidebar.",
      "Update organization details such as name, acronym, description, and social links.",
      "If changing password, confirm the password change dialog.",
      "Confirm save to persist your updates.",
    ],
    notes: [
      "This page is only available to Admin / Organization users.",
      "Keep email and password entries accurate to avoid login issues.",
    ],
    allowedRoles: [UserType.ORGANIZATION],
  },
  {
    id: "system-administration",
    title: "System Administration",
    shortDescription: "Monitor platform health and supervise cross-organization activity.",
    whatItDoes:
      "Superadmin can use dashboard and moderation features to monitor platform-wide activity and keep operations consistent.",
    steps: [
      "Review dashboard totals for organizations and event volume.",
      "Track upcoming and ongoing event distribution for planning.",
      "Resolve ticket requests promptly to keep event ticketing operational.",
      "Review organizations and parent groups regularly for clean data structure.",
    ],
    notes: [
      "This guide is Superadmin-only because it covers system-wide operations.",
    ],
    allowedRoles: [UserType.ADMIN],
  },
];

export const helpFaqs: HelpFaq[] = [
  {
    id: "faq-create-event",
    question: "How do I create an event?",
    answer:
      "Go to My Events, click Add Event, complete required fields, and save. Publish when the event is ready for visibility.",
  },
  {
    id: "faq-event-date",
    question: "Why is my event date rejected?",
    answer:
      "Start date/time must be in the future, and end date/time must be later than start date/time.",
  },
  {
    id: "faq-archive-event",
    question: "Why can’t I archive an event?",
    answer:
      "Events with registered participants cannot be archived until registration-related constraints are resolved.",
  },
  {
    id: "faq-update-organization",
    question: "How do I update organization information?",
    answer:
      "Superadmin can update organization records in Organizations. Organization users can update their own profile in Account.",
  },
  {
    id: "faq-approve-requests",
    question: "Who can approve ticket requests?",
    answer:
      "Only Superadmin (ADMIN) can approve, decline, or revert ticket requests.",
    allowedRoles: [UserType.ADMIN],
  },
  {
    id: "faq-cancel-request",
    question: "Can organizations cancel ticket requests?",
    answer:
      "Yes. Organizations can cancel their own pending requests. Approved and declined requests require Superadmin action for re-evaluation.",
    allowedRoles: [UserType.ORGANIZATION],
  },
  {
    id: "faq-missing-feature",
    question: "Why can’t I see certain features?",
    answer:
      "The system is role-aware. If a page or action is missing, your current role does not have access to it.",
  },
];

export function isRoleAllowed(
  allowedRoles: UserType[] | undefined,
  role: UserType,
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(role);
}
