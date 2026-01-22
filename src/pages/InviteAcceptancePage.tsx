import { useEffect, useMemo, useState } from "react";
import { acceptInviteToken } from "../firebase/acceptInvite";
import { auth, firestore } from "../firebase/firebaseClient";

const STATUS_COPY: Record<string, string> = {
  idle: "Ready to accept your invite.",
  accepting: "Accepting invite…",
  success: "Invite accepted! Redirecting…",
  "invalid-token": "Invite token is missing or invalid.",
  "invite-not-found": "We couldn’t find that invite.",
  "invite-expired": "That invite has expired.",
  "invite-already-accepted": "That invite has already been accepted.",
  "member-already-linked": "That member is already linked to a different user.",
  error: "Something went wrong while accepting the invite.",
};

type StatusKey = keyof typeof STATUS_COPY;

export function InviteAcceptancePage() {
  const [status, setStatus] = useState<StatusKey>("idle");
  const token = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("token") ?? "";
  }, []);

  useEffect(() => {
    const handleInvite = async () => {
      if (!token) {
        setStatus("invalid-token");
        return;
      }

      const user = auth.currentUser;

      if (!user) {
        setStatus("error");
        return;
      }

      setStatus("accepting");
      const response = await acceptInviteToken(firestore, token, user.uid);

      if (!response.ok) {
        setStatus(response.reason);
        return;
      }

      setStatus("success");
      window.setTimeout(() => {
        window.location.assign(`/orgs/${response.value.orgId}`);
      }, 1500);
    };

    void handleInvite();
  }, [token]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#f7f7fb",
      }}
    >
      <section
        style={{
          maxWidth: 480,
          width: "90%",
          padding: "2.5rem",
          borderRadius: 16,
          background: "white",
          boxShadow: "0 16px 40px rgba(20, 20, 60, 0.12)",
        }}
      >
        <h1 style={{ marginBottom: "0.5rem" }}>Invite Acceptance</h1>
        <p style={{ margin: 0, color: "#4c4c6b" }}>{STATUS_COPY[status]}</p>
      </section>
    </main>
  );
}
