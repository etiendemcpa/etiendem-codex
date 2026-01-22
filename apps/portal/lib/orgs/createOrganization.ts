import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "../firebase/admin";

export type CreateOrganizationInput = {
  name: string;
  userId: string;
};

export const createOrganizationForUser = async ({ name, userId }: CreateOrganizationInput) => {
  const orgRef = adminDb.collection("organizations").doc();
  const memberRef = adminDb.collection("orgMembers").doc();
  const now = Timestamp.now();

  const batch = adminDb.batch();
  batch.set(orgRef, {
    name,
    createdAt: now,
    createdBy: userId,
  });
  batch.set(memberRef, {
    orgId: orgRef.id,
    userId,
    role: "owner",
    appRoles: [],
    createdAt: now,
  });

  await batch.commit();

  return { orgId: orgRef.id };
};
