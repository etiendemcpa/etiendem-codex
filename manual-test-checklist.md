# Manual Test Checklist: Multi-Org, Multi-App, and Access Control

## Multi-org users
1. Log in as a user assigned to at least two organizations (Org A and Org B).
2. Open the org switcher and select Org A.
3. Verify Org A context loads (branding, org name, org-specific data).
4. Navigate to a resource list (e.g., projects, users, invoices) and confirm only Org A data is visible.
5. Switch to Org B via the org switcher.
6. Verify Org B context loads and Org A data is no longer visible.
7. Open a deep link to an Org A resource while in Org B context.
8. Confirm the app either blocks access or automatically switches to Org A (per expected behavior).
9. Repeat steps 2–8 on another browser tab to ensure contexts remain isolated per tab/session.

## Multi-app subscriptions
1. Log in as a user with subscriptions to App 1 and App 2.
2. Open the app switcher and select App 1.
3. Verify App 1 dashboard loads and App 1 navigation is visible.
4. Attempt to access an App 2-only feature via direct URL.
5. Confirm access is denied or redirected to an upgrade/landing page (per expected behavior).
6. Switch to App 2 via the app switcher.
7. Verify App 2 dashboard loads and App 2 navigation is visible.
8. Confirm App 1-only features are not accessible in App 2.
9. Remove App 2 subscription from the account (or use a test user without it).
10. Refresh and confirm App 2 no longer appears in the app switcher and direct URLs are blocked.

## Role isolation
1. Log in as an Org Admin in Org A.
2. Open the admin-only area (e.g., settings, user management).
3. Confirm admin controls are visible and functional.
4. Log out and log in as a standard member in the same org.
5. Attempt to access the admin-only area via navigation.
6. Confirm the area is hidden or inaccessible.
7. Attempt to access a specific admin-only URL directly.
8. Confirm access is denied with a clear error state.
9. Repeat with a read-only or support role if available to verify least-privilege access.

## Access denial
1. Log in as a user without membership in Org C.
2. Attempt to access Org C resources via direct URL.
3. Confirm access is denied and no Org C data is exposed.
4. Log in as a user without App 3 subscription.
5. Attempt to access App 3 via direct URL.
6. Confirm access is denied or routed to an upgrade page.
7. Use an expired session (or revoke permissions) and attempt to access a protected resource.
8. Confirm the app prompts re-authentication or shows a forbidden state.
9. Validate the denial message does not leak sensitive identifiers or data.
