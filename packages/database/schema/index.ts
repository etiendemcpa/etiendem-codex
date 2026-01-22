import { z } from "zod";

export const userProfileSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1).optional(),
  photoUrl: z.string().url().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const organizationSchema = z.object({
  orgId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const orgMemberSchema = z.object({
  orgId: z.string().min(1),
  uid: z.string().min(1),
  role: z.string().min(1),
  joinedAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type OrgMember = z.infer<typeof orgMemberSchema>;
