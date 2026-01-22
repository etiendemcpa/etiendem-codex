import type { ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: ProviderProps) {
  return <>{children}</>;
}

function OrganizationProvider({ children }: ProviderProps) {
  return <>{children}</>;
}

function OrganizationSwitcher() {
  return (
    <div
      aria-label="Organization switcher"
      style={{
        border: "1px dashed #cbd5f5",
        borderRadius: "999px",
        padding: "0.35rem 0.75rem",
        fontSize: "0.875rem",
      }}
    >
      Organization switcher
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <AuthProvider>
          <OrganizationProvider>
            <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
              <header
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.5rem",
                  background: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    App Dashboard
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                    Placeholder layout
                  </div>
                </div>
                <OrganizationSwitcher />
              </header>
              <main style={{ padding: "2rem 1.5rem" }}>
                <section
                  style={{
                    background: "#ffffff",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    padding: "1.5rem",
                  }}
                >
                  <h1 style={{ marginTop: 0 }}>Simple dashboard placeholder</h1>
                  <p style={{ marginBottom: 0, color: "#475569" }}>
                    This area will host the dashboard widgets and data once the
                    app is wired up.
                  </p>
                </section>
                {children}
              </main>
            </div>
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
