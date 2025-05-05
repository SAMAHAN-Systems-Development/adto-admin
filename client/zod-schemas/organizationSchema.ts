import { z } from "zod";

export const organizationSchema = z.object({
  organizationName: z.string(),
  organizationAcronym: z.string(),
  organizationIcon: z.string(),
  organizationDescription: z.string(),
  facebookLink: z.string(),
  twitterLink: z.string(),
  linkedinLink: z.string(),
});

export default organizationSchema;
