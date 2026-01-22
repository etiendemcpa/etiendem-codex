import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

export type InviteAcceptanceResult = {
  orgId: string;
  orgMemberId: string;
  inviteId: string;
};

export type InviteAcceptanceError =
  | "invalid-token"
  | "invite-not-found"
  | "invite-expired"
  | "invite-already-accepted"
  | "member-already-linked";

export type InviteAcceptanceResponse =
  | { ok: true; value: InviteAcceptanceResult }
  | { ok: false; reason: InviteAcceptanceError };

const INVITE_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 14;

export type InviteDocument = {
  orgId: string;
  orgMemberId: string;
  status: "pending" | "accepted" | "revoked";
  createdAt: { toMillis: () => number };
};

export type OrgMemberDocument = {
  status: "invited" | "active" | "disabled";
  userId?: string | null;
};

export async function acceptInviteToken(
  firestore: Firestore,
  token: string,
  userId: string,
): Promise<InviteAcceptanceResponse> {
  if (!token.trim()) {
    return { ok: false, reason: "invalid-token" };
  }

  const inviteRef = doc(firestore, "orgInvites", token);
  const inviteSnapshot = await getDoc(inviteRef);

  if (!inviteSnapshot.exists()) {
    return { ok: false, reason: "invite-not-found" };
  }

  const invite = inviteSnapshot.data() as InviteDocument;

  if (invite.status === "accepted") {
    return { ok: false, reason: "invite-already-accepted" };
  }

  const isExpired =
    Date.now() - invite.createdAt.toMillis() > INVITE_EXPIRATION_MS;

  if (isExpired) {
    return { ok: false, reason: "invite-expired" };
  }

  const memberRef = doc(
    firestore,
    "orgs",
    invite.orgId,
    "members",
    invite.orgMemberId,
  );
  const memberSnapshot = await getDoc(memberRef);

  if (!memberSnapshot.exists()) {
    return { ok: false, reason: "invite-not-found" };
  }

  const member = memberSnapshot.data() as OrgMemberDocument;

  if (member.userId && member.userId !== userId) {
    return { ok: false, reason: "member-already-linked" };
  }

  await Promise.all([
    updateDoc(inviteRef, {
      status: "accepted",
      acceptedAt: serverTimestamp(),
      acceptedBy: userId,
    }),
    updateDoc(memberRef, {
      status: "active",
      userId,
      activatedAt: serverTimestamp(),
    }),
  ]);

  return {
    ok: true,
    value: {
      orgId: invite.orgId,
      orgMemberId: invite.orgMemberId,
      inviteId: inviteSnapshot.id,
    },
  };
}
