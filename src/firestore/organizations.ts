import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Firestore,
} from "firebase/firestore";

export type Organization = {
  id: string;
  name?: string;
  [key: string]: unknown;
};

type MembershipDoc = {
  orgId: string;
  userId: string;
};

export const fetchUserOrganizations = async (
  db: Firestore,
  userId: string
): Promise<Organization[]> => {
  const membershipsRef = collection(db, "orgMemberships");
  const membershipsQuery = query(
    membershipsRef,
    where("userId", "==", userId)
  );

  const membershipsSnapshot = await getDocs(membershipsQuery);
  const membershipDocs = membershipsSnapshot.docs.map((docSnap) => {
    return docSnap.data() as MembershipDoc;
  });

  const organizations = await Promise.all(
    membershipDocs.map(async (membership) => {
      const orgRef = doc(db, "organizations", membership.orgId);
      const orgSnapshot = await getDoc(orgRef);

      if (!orgSnapshot.exists()) {
        return null;
      }

      return {
        id: orgSnapshot.id,
        ...orgSnapshot.data(),
      } as Organization;
    })
  );

  return organizations.filter(
    (organization): organization is Organization => organization !== null
  );
};
