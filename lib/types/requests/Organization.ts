export interface OrganizationRequest {
    name: string;
    acronym?: string;
    email: string;
    password: string;
    icon?: File | null;
    description?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    isActive: boolean;
    isAdmin: boolean;
}