import { adminDb } from "../firebase/admin";

export type OrganizationSummary = {
  id: string;
  name: string;
};

export const getUserOrganizations = async (userId: string): Promise<OrganizationSummary[]> => {
  const membershipSnapshot = await adminDb
    .collection("orgMembers")
    .where("userId", "==", userId)
    .get();

  if (membershipSnapshot.empty) {
    return [];
  }

  const orgIds = membershipSnapshot.docs.map((doc) => doc.get("orgId") as string);
  const orgSnapshots = await Promise.all(
    orgIds.map((orgId) => adminDb.collection("organizations").doc(orgId).get())
  );

  return orgSnapshots
    .filter((doc) => doc.exists)
    .map((doc) => ({ id: doc.id, name: doc.get("name") as string }));
};
