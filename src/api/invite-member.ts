import { inviteMember } from "../lib/inviteMember";

export type InviteMemberRequestBody = {
  orgId?: string;
  email?: string;
  role?: string;
  invitedBy?: string;
};

export async function inviteMemberHandler(
  req: { body?: InviteMemberRequestBody },
  res: {
    status: (code: number) => { json: (payload: unknown) => void };
  },
): Promise<void> {
  try {
    const { orgId, email, role, invitedBy } = req.body ?? {};
    const result = await inviteMember({
      orgId: orgId ?? "",
      email: email ?? "",
      role: role ?? "",
      invitedBy: invitedBy ?? "",
    });

    res.status(200).json({
      ok: true,
      inviteLink: result.inviteLink,
      inviteToken: result.inviteToken,
      memberId: result.memberId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ ok: false, error: message });
  }
}
