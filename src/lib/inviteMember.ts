import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { getFirestoreDb } from "./firestore";

export type InviteMemberInput = {
  orgId: string;
  email: string;
  role: string;
  invitedBy: string;
};

export type InviteMemberResult = {
  inviteLink: string;
  inviteToken: string;
  memberId: string;
};

const INVITE_BASE_URL = process.env.INVITE_BASE_URL ?? "https://example.com";

function buildInviteLink(inviteToken: string): string {
  return `${INVITE_BASE_URL}/invites/accept?token=${inviteToken}`;
}

async function sendMockInviteEmail(email: string, inviteLink: string): Promise<void> {
  // Replace with a real email provider integration.
  console.log(`Mock invite email to ${email}: ${inviteLink}`);
}

export async function inviteMember({
  orgId,
  email,
  role,
  invitedBy,
}: InviteMemberInput): Promise<InviteMemberResult> {
  if (!orgId || !email || !role || !invitedBy) {
    throw new Error("orgId, email, role, and invitedBy are required");
  }

  const db = getFirestoreDb();
  const inviteToken = crypto.randomUUID();
  const inviteLink = buildInviteLink(inviteToken);
  const createdAt = Timestamp.now();

  const memberRef = db.collection("orgMembers").doc();
  const inviteRef = db.collection("orgInvites").doc(inviteToken);

  const batch = db.batch();
  batch.set(memberRef, {
    orgId,
    email,
    role,
    status: "invited",
    invitedAt: createdAt,
    invitedBy,
  });
  batch.set(inviteRef, {
    orgId,
    email,
    role,
    status: "pending",
    token: inviteToken,
    inviteLink,
    createdAt,
    invitedBy,
  });

  await batch.commit();
  await sendMockInviteEmail(email, inviteLink);

  return {
    inviteLink,
    inviteToken,
    memberId: memberRef.id,
  };
}
