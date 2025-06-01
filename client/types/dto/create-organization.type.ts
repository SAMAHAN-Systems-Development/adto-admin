export interface CreateOrganizationDto {
  name: string;
  acronym: string;
  icon: string;
  links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}
